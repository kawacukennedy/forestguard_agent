import hashlib
from datetime import datetime
import random
import json

def run_zeta_agent(incident_data, pdf_path, hash_value=None, chains=["solana", "sui", "ton"]):
    # Mock ZetaChain omnichain NFT minting
    # In real implementation, use ZetaChain SDK to mint Universal NFT across chains
    if not hash_value:
        data = f"{incident_data['id']}{incident_data['carbon_estimate']}{datetime.utcnow().isoformat()}"
        hash_value = hashlib.sha256(data.encode()).hexdigest()

    zeta_tx_hashes = {}
    nft_ids = {}

    for chain in chains:
        # Simulate onCall: trigger cross-chain mint
        try:
            # Mock transaction hash for each chain
            tx_hash = f"{chain}_tx_{hash_value[:16]}_{random.randint(1000,9999)}"
            zeta_tx_hashes[chain] = tx_hash

            # Mock NFT ID
            nft_id = f"nft_{chain}_{incident_data['id']}_{hash_value[:8]}"
            nft_ids[chain] = nft_id

            # Simulate successful mint
            print(f"onCall: Minted NFT on {chain} with tx {tx_hash}")

        except Exception as e:
            # onRevert: rollback if failed
            print(f"onRevert: Failed to mint on {chain}, rolling back. Error: {e}")
            # In real, revert previous transactions
            return {"status": "failed", "error": f"Minting failed on {chain}", "reverted_chains": list(zeta_tx_hashes.keys())}

    # If all succeed, assign reward points
    reward_points = incident_data.get('carbon_estimate', 0.0) * 1.0

    # onAbort not triggered since success
    return {
        "zeta_tx_hashes": zeta_tx_hashes,
        "nft_ids": nft_ids,
        "reward_points": reward_points,
        "status": "NFT minted across chains via ZetaChain"
    }