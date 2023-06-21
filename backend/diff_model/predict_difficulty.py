import numpy as np
import torch

from .api.diff_model.get_latent_space import get_backbone
from .api.diff_model.model import gpt2_classiffier_2_multi, prediction2label

import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

def predict_difficulty(machine_readable_mtrx):
    """
    Predict the difficulty of a score from a bootleg binarymatrix.
    :return: a tuple of three ints, each representing the difficulty of the score for each dataset.
    """
    backbone_embedding = get_backbone(machine_readable_mtrx)
    seed = 42
    np.random.seed(seed)
    torch.manual_seed(seed)

    device = 'cpu'
    model = gpt2_classiffier_2_multi(
        checkpoint_dir=f"diff_model/models/pt2-imslp-ft_fc5_real", device=device
    )
    checkpoint = torch.load(
        f"diff_model/models/multi_weighted_per_dataset/checkpoint_0.pth",
        map_location=torch.device('cpu')
    )

    model.load_state_dict(checkpoint['model_state_dict'])

    model.eval()

    ans = model(backbone_embedding.unsqueeze(0), torch.Tensor([backbone_embedding.shape[0]]).int())

    return prediction2label(ans[0]).detach().tolist()[0], \
        prediction2label(ans[1]).detach().tolist()[0], \
        prediction2label(ans[2]).detach().tolist()[0]
