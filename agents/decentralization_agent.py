import hashlib
from datetime import datetime
import random

def run_decentralization_agent(incident_data, pdf_path, hash_value=None):
    # Mock Somnia network publishing
    # In real implementation, use Somnia SDK to publish data to decentralized network
    if not hash_value:
        data = f"{incident_data['id']}{incident_data['carbon_estimate']}{datetime.utcnow().isoformat()}"
        hash_value = hashlib.sha256(data.encode()).hexdigest()

    # Simulate transaction hash
    tx_hash = f"somnia_tx_{hash_value[:16]}"

    # Mint NFT for the incident
    # Mock NFT minting: generate a unique NFT ID
    nft_id = f"nft_{incident_data['id']}_{hash_value[:8]}"

    # Assign reward points based on carbon estimate (e.g., 1 point per ton of carbon)
    reward_points = incident_data.get('carbon_estimate', 0.0) * 1.0  # Adjust multiplier as needed

    # Publish to Somnia and mint NFT (mock)
    return {
        "somnia_tx_hash": tx_hash,
        "nft_id": nft_id,
        "reward_points": reward_points,
        "status": "published to Somnia network and NFT minted"
    }