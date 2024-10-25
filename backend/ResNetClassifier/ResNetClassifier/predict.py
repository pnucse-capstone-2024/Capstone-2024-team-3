import os
import sys
import torch
from torchvision import transforms
import numpy as np
from torch.nn import functional as F 
import nibabel as nib
from ResNet import generate_model as generate_res
from dataset import MinMaxNormalization
import matplotlib.pyplot as plt

# Define the transformation pipeline
transform = transforms.Compose([
    transforms.ToTensor(),
    MinMaxNormalization(min_value=0.0, max_value=1.0),
    transforms.Lambda(lambda x: x.type(torch.float32)),
    transforms.Lambda(lambda x: x.unsqueeze(0)),  # Add channel dimension for grayscale input
])

# Load the model with appropriate device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = generate_res(10, n_input_channels=1, n_classes=2, conv1_t_stride=2)
model.load_state_dict(torch.load('model.pth', map_location=device))  # Load trained model
model = model.to(device)  # Move model to device
model.eval()  # Set model to evaluation mode

def predict(image_path):
    # Load the NIfTI file using nibabel
    img_nii = nib.load(image_path)
    img_data = img_nii.get_fdata()

    # Handle 3D/4D shape
    if len(img_data.shape) == 4:  # If it's 4D, take the first volume
        img_data = img_data[:, :, :, 0]
    
    # Normalize the image data using min-max scaling
    img_data = (img_data - np.min(img_data)) / (np.max(img_data) - np.min(img_data))

    # Apply transformations
    img_data = transform(img_data)

    # Add batch dimension (1, 1, D, H, W) for inference
    image = img_data.unsqueeze(0).to(device)

    # Enable gradient tracking for the input image
    image.requires_grad = True 

    outputs = model(image)
    probabilities = F.softmax(outputs, dim=1)  # Get class probabilities
    _, predicted = torch.max(outputs, 1)  # Get predicted class

    # Calculate gradients 
    loss = F.cross_entropy(outputs, predicted)
    model.zero_grad()   # Clear previous gradients 
    loss.backward()     # Backpropagate to get gradients 

    # Get the gradients of the input image
    gradients = image.grad.data.abs()  # Absolute value of gradients  

    # Create a saliency map by summing the gradients over the channels 
    saliency_map = gradients.sum(dim=1).squeeze().cpu().numpy()
    saliency_map = np.maximum(saliency_map, 0)  # ReLU to get positive values 
    saliency_map = saliency_map / saliency_map.max()  # Normalize the saliency map

    probabilities = probabilities.detach().cpu().numpy()[0]  # Convert to NumPy array
    predicted_class = predicted.item() 
    class_map = {0: 'PD', 1: 'Control'}
    predicted_label = class_map[predicted_class]

    return img_data, saliency_map, predicted_label, probabilities

def visualize_saliency(original_image, saliency_map, save_dir):
    # Convert tensors to numpy arrays for visualization
    original_image_np = original_image.squeeze().cpu().numpy()
    saliency_map_np = saliency_map

    # Select a middle slice for visualization
    mid_slice_idx = 41
    original_slice = original_image_np[mid_slice_idx, :, :]
    saliency_slice = saliency_map_np[mid_slice_idx, :, :]

    # Rescale original image using percentile-based normalization
    p1, p99 = np.percentile(original_slice, (1, 99))
    original_slice_rescaled = (original_slice - p1) / (p99 - p1)
    original_slice_rescaled = np.clip(original_slice_rescaled, 0, 1)  # Ensure values are in [0, 1]

    saliency_slice_rescaled = (saliency_slice - saliency_slice.min()) / (saliency_slice.max() - saliency_slice.min())

    # Ensure the rescaled images are floats
    original_slice_rescaled = original_slice_rescaled.astype(np.float32)
    saliency_slice_rescaled = saliency_slice_rescaled.astype(np.float32)

    # Create a colormap for the saliency map
    colormap = plt.cm.jet(saliency_slice_rescaled)[:, :, :3]  # Shape: (H, W, 3)

    # Add a channel dimension to the original slice
    original_slice_rescaled = np.expand_dims(original_slice_rescaled, axis=-1)  # Shape: (H, W, 1)

    # Blend original image with the saliency map
    overlay = 0.5 * original_slice_rescaled + 0.5 * colormap

    # Ensure the overlay is in the correct range [0, 1]
    overlay = np.clip(overlay, 0, 1)

    # Save each subplot as a separate image
    plt.figure(figsize=(5, 5))
    plt.imshow(original_slice_rescaled.squeeze(), cmap='gray')
    plt.axis('off')
    plt.savefig(f"{save_dir}/original_image_slice.png", bbox_inches='tight', pad_inches=0, dpi=300)
    plt.close()

    plt.figure(figsize=(5, 5))
    plt.imshow(saliency_slice_rescaled, cmap='hot')
    plt.axis('off')
    plt.savefig(f"{save_dir}/saliency_map_slice.png", bbox_inches='tight', pad_inches=0, dpi=300)
    plt.close()

    plt.figure(figsize=(5, 5))
    plt.imshow(overlay)
    plt.axis('off')
    plt.savefig(f"{save_dir}/overlay_slice.png", bbox_inches='tight', pad_inches=0, dpi=300)
    plt.close()

# Example usage:
image_path = sys.argv[1]
output_dir = sys.argv[2]

if not os.path.exists(output_dir):
    os.makedirs(output_dir)
original_image, saliency_map, predicted_label, probabilities = predict(image_path)

# Calculate the probability of the predicted class
probability = max(probabilities) * 100

print(f"Predicted class: {predicted_label}")
print(f"With probability of: {probability:.2f}%")

# Call the visualization function
visualize_saliency(original_image, saliency_map, output_dir)
