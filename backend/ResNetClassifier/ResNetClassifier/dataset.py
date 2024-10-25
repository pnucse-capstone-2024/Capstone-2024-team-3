import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
import os
import numpy as np
import nibabel as nib
import torch.nn.functional as F

class PPMIdataset(Dataset):
    def __init__(self, table, base_dir, class_id, transform=None):

        self.labels = []
        self.data = []

        for idx, row in table.iterrows():
            patno = str(row['PATNO'])
            cohort = row['CONCOHORT']
            caudate_r = row['DATSCAN_CAUDATE_R']
            caudate_l = row['DATSCAN_CAUDATE_L']
            putamen_r = row['DATSCAN_PUTAMEN_R']
            putamen_l = row['DATSCAN_PUTAMEN_L']
            putamen_a_r = row['DATSCAN_PUTAMEN_R_ANT']
            putamen_a_l = row['DATSCAN_PUTAMEN_L_ANT']

            if row['SPECT_ID'][0] == 'D':
                sid = 'I' + row['SPECT_ID'][1:]
            else:
                sid = row['SPECT_ID']
            img = None

            sup_path = os.path.join(base_dir, patno, "Reconstructed_DaTSCAN") 
            imgf_list = os.listdir(sup_path)
            for imgf in imgf_list:
                searched_sids = os.listdir(os.path.join(sup_path, imgf))
                if sid in searched_sids:
                    img = os.path.join(sup_path, imgf, sid, os.listdir(os.path.join(sup_path, imgf, sid))[0])
            
            if img == None or (os.path.isfile(img) == False):
                raise RuntimeError("No matched image file for PATNO-{}".format(patno))

            if cohort in class_id:
                self.labels.append(cohort)
                self.data.append((img, (caudate_r, caudate_l, putamen_r, putamen_l, putamen_a_r, putamen_a_l)))

        self.transform = transform
        
        unique_labels = sorted(set(self.labels))
        label_to_index = {label: index for index, label in enumerate(unique_labels)}
        self.labels = [label_to_index[label] for label in self.labels]

        self.labels = torch.tensor(self.labels)

        # self.img_labels = F.one_hot(self.img_labels, num_classes=len(class_id))


    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        label = self.labels[idx]
        img_path = self.data[idx][0]
        sbr = self.data[idx][1]
        image = nib.load(img_path).get_fdata()
        
        if len(image.shape) != 3:
            image = image[:,:,:,0]

        if self.transform:
            image = self.transform(image)

        return (image, sbr), label
    
class MinMaxNormalization:
    def __init__(self, min_value=0.0, max_value=1.0):
        self.min_value = min_value
        self.max_value = max_value
    
    def __call__(self, tensor):
        tensor_min = tensor.min()
        tensor_max = tensor.max()
        normalized_tensor = (tensor - tensor_min) / (tensor_max - tensor_min)
        
        scaled_tensor = normalized_tensor * (self.max_value - self.min_value) + self.min_value
        return scaled_tensor