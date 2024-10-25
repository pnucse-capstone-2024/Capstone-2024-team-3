from dataset import PPMIdataset, MinMaxNormalization
import pandas as pd
from torchvision import transforms
from ResNet import generate_model as generate_res
from sklearn.model_selection import StratifiedShuffleSplit, StratifiedKFold
from sklearn.metrics import confusion_matrix, classification_report, precision_recall_fscore_support
from torch.utils.data import Subset, DataLoader
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np 

num_epochs = 50
learning_rate = 0.001

transform = transforms.Compose([
    transforms.ToTensor(),  # Convert image to a PyTorch tensor
    MinMaxNormalization(min_value=0.0, max_value=1.0), # Rescale pixel values to [0.0, 1.0]
    transforms.Lambda(lambda x: x.type(torch.float32)), # Ensure tensor is of type float32
    transforms.Lambda(lambda x: x.unsqueeze(0)), # Add new dimension for batch input
])

table = pd.read_excel("./curated_data.xlsx", index_col=0) # Load dataset from Excel 
dataset = PPMIdataset(table, "../PPMI_DaT_nii_align", [1,2], transform)

split = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=42) 

# Split dataset into training/validation and test sets
for train_index, test_index in split.split(dataset.data, dataset.labels):
    train_valid_dataset = Subset(dataset, train_index)
    test_dataset = Subset(dataset, test_index)

train_valid_labels = [dataset.labels[i] for i in train_index]


skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for fold, (train_idx, valid_idx) in enumerate(skf.split(train_index, train_valid_labels)):

    model = generate_res(10, n_input_channels=1, n_classes=2, conv1_t_stride=1)
    model = model.cuda()

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    actual_train_idx = [train_index[i] for i in train_idx]
    actual_valid_idx = [train_index[i] for i in valid_idx]
    
    train_subset = Subset(dataset, actual_train_idx)
    valid_subset = Subset(dataset, actual_valid_idx)
    
    train_loader = DataLoader(train_subset, batch_size=32, shuffle=True)
    valid_loader = DataLoader(valid_subset, batch_size=32, shuffle=False)

    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0

        for data, labels in train_loader:
            data, labels = data[0].cuda(), labels.cuda()

            optimizer.zero_grad()
            outputs = model(data)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
        model.eval()
        valid_loss = 0.0
        correct = 0
        total = 0

        all_labels = []
        all_preds = []

        with torch.no_grad():
            for data, labels in valid_loader:
                data, labels = data[0].cuda(), labels.cuda()
                
                outputs = model(data)
                loss = criterion(outputs, labels)

                valid_loss += loss.item()

                _, predicted = torch.max(outputs, 1)
                total += labels.size(0)
                correct += (predicted == labels).sum().item()

                all_labels.extend(labels.cpu().numpy())
                all_preds.extend(predicted.cpu().numpy())

        print(f"Epoch [{epoch+1}/{num_epochs}],"
              f"Train Loss: {running_loss/len(train_loader):.4f},"
              f"Valid Loss: {valid_loss/len(valid_loader):.4f},"
              f"Valid Accuracy: {100 * correct / total:.2f}%")
        
    # Save the model after the fold is completed
    model_save_path = f"model_fold_{fold}.pth"
    torch.save(model.state_dict(), model_save_path)
    print(f"Model for fold {fold} saved to {model_save_path}")

    # Compute confusion matrix and other metrics
    cm = confusion_matrix(all_labels, all_preds)
    print(f"Confusion Matrix for fold {fold}:\n{cm}")

    class_report = classification_report(all_labels, all_preds, target_names=['Class 0', 'Class 1'])
    print(f"Classification Report for fold {fold}:\n{class_report}")

    precision, recall, f1, _ = precision_recall_fscore_support(all_labels, all_preds)
    print(f"Precision, Recall, F1 Score for fold {fold}:")
    print(f"Precision: {precision}")
    print(f"Recall: {recall}")
    print(f"F1 Score: {f1}")

print("Training completed and models saved.")
