from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.journey import JourneyNode as JourneyNodeModel
from app.schemas.journey import JourneyNode, JourneyNodeCreate
from app.config import settings

router = APIRouter(tags=["journey"])

def verify_admin_key(x_admin_key: str = Header(...)):
    if x_admin_key != settings.secret_admin_key:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid admin key")

@router.get("/journey-nodes", response_model=List[JourneyNode])
def read_journey_nodes(db: Session = Depends(get_db)):
    return (
        db.query(JourneyNodeModel)
        .order_by(JourneyNodeModel.sort_order.asc(), JourneyNodeModel.id.asc())
        .all()
    )

@router.post("/admin/journey-nodes", response_model=JourneyNode)
def create_journey_node(
    node: JourneyNodeCreate,
    db: Session = Depends(get_db),
    admin: None = Depends(verify_admin_key),
):
    # Check if node_id already exists
    existing = db.query(JourneyNodeModel).filter(JourneyNodeModel.node_id == node.node_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Milestone with this Node ID already exists")

    db_node = JourneyNodeModel(**node.model_dump())
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    return db_node

@router.put("/admin/journey-nodes/{node_id}", response_model=JourneyNode)
def update_journey_node(
    node_id: str,
    node_update: JourneyNodeCreate,
    db: Session = Depends(get_db),
    admin: None = Depends(verify_admin_key),
):
    db_node = db.query(JourneyNodeModel).filter(JourneyNodeModel.node_id == node_id).first()
    if not db_node:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    # If they are changing the node_id, make sure the new one is not taken
    if node_update.node_id != node_id:
        existing = db.query(JourneyNodeModel).filter(JourneyNodeModel.node_id == node_update.node_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Another milestone with this Node ID already exists")

    for key, value in node_update.model_dump().items():
        setattr(db_node, key, value)
    
    db.commit()
    db.refresh(db_node)
    return db_node

@router.delete("/admin/journey-nodes/{node_id}")
def delete_journey_node(
    node_id: str,
    db: Session = Depends(get_db),
    admin: None = Depends(verify_admin_key),
):
    db_node = db.query(JourneyNodeModel).filter(JourneyNodeModel.node_id == node_id).first()
    if not db_node:
        raise HTTPException(status_code=404, detail="Milestone not found")
    
    db.delete(db_node)
    db.commit()
    return {"status": "ok", "message": "Milestone deleted successfully"}
