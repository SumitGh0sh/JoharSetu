import hashlib
import json
import time
from typing import List, Dict, Any, Optional

class AuditBlock:
    def __init__(self, index: int, previous_hash: str, ticket_id: str, action: str, data: Dict[str, Any], timestamp: Optional[float] = None):
        self.index = index
        self.timestamp = timestamp if timestamp is not None else time.time()
        self.previous_hash = previous_hash
        self.ticket_id = ticket_id
        self.action = action
        self.data = data
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        payload = {
            "index": self.index,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "ticket_id": self.ticket_id,
            "action": self.action,
            "data": self.data
        }
        raw = json.dumps(payload, sort_keys=True)
        return hashlib.sha256(raw.encode("utf-8")).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "ticket_id": self.ticket_id,
            "action": self.action,
            "data": self.data,
            "hash": self.hash
        }

class JoharTamperProofLedger:
    def __init__(self):
        self.chain: List[AuditBlock] = []
        self._init_genesis()

    def _init_genesis(self):
        genesis = AuditBlock(
            index=0,
            previous_hash="0" * 64,
            ticket_id="GENESIS",
            action="INITIALIZE_LEDGER",
            data={"authority": "Govt of Jharkhand - Dept of Higher & Technical Education", "protocol": "JoharSetu-Audit-v1"},
            timestamp=1725475200.0
        )
        self.chain.append(genesis)

    def get_latest_block(self) -> AuditBlock:
        return self.chain[-1]

    def record_event(self, ticket_id: str, action: str, data: Dict[str, Any]) -> AuditBlock:
        prev = self.get_latest_block()
        new_block = AuditBlock(
            index=len(self.chain),
            previous_hash=prev.hash,
            ticket_id=ticket_id,
            action=action,
            data=data
        )
        self.chain.append(new_block)
        return new_block

    def verify_integrity(self) -> Dict[str, Any]:
        """
        Verifies every single block in the chain to confirm no record has been tampered with.
        """
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i-1]

            if curr.previous_hash != prev.hash:
                return {
                    "is_valid": False,
                    "error_at_block": i,
                    "reason": "Previous hash link broken."
                }
            if curr.hash != curr.calculate_hash():
                return {
                    "is_valid": False,
                    "error_at_block": i,
                    "reason": "Data integrity hash corrupted."
                }

        return {
            "is_valid": True,
            "total_blocks": len(self.chain),
            "head_hash": self.chain[-1].hash
        }

    def get_chain_history(self, ticket_id: Optional[str] = None) -> List[Dict[str, Any]]:
        if ticket_id:
            return [b.to_dict() for b in self.chain if b.ticket_id == ticket_id or b.ticket_id == "GENESIS"]
        return [b.to_dict() for b in self.chain]

# Singleton instance
global_ledger = JoharTamperProofLedger()
