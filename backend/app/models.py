from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Adventure(Base):
    __tablename__ = "adventures"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    goal: Mapped[str] = mapped_column(Text, default="")
    difficulty: Mapped[str] = mapped_column(String(40))
    duration_minutes: Mapped[int] = mapped_column(Integer)
    activity: Mapped[str] = mapped_column(String(80))
    payload_json: Mapped[str] = mapped_column(Text)
    route_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    downloaded: Mapped[bool] = mapped_column(Boolean, default=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(40), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    observations: Mapped[list["Observation"]] = relationship(back_populates="adventure", cascade="all, delete-orphan")
    journal: Mapped["Journal | None"] = relationship(back_populates="adventure", uselist=False, cascade="all, delete-orphan")


class Observation(Base):
    __tablename__ = "observations"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    adventure_id: Mapped[str] = mapped_column(ForeignKey("adventures.id"))
    category: Mapped[str] = mapped_column(String(80))
    note: Mapped[str] = mapped_column(Text, default="")
    transcript: Mapped[str] = mapped_column(Text, default="")
    photo_path: Mapped[str | None] = mapped_column(String, nullable=True)
    audio_path: Mapped[str | None] = mapped_column(String, nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    ai_label: Mapped[str | None] = mapped_column(String, nullable=True)
    ai_confidence: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    adventure: Mapped[Adventure] = relationship(back_populates="observations")


class Journal(Base):
    __tablename__ = "journals"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    adventure_id: Mapped[str] = mapped_column(ForeignKey("adventures.id"), unique=True)
    title: Mapped[str] = mapped_column(String(200))
    body_json: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    adventure: Mapped[Adventure] = relationship(back_populates="journal")
