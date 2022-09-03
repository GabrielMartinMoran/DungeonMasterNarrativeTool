from typing import List

from pymodelio import pymodelio_model, Attribute
from pymodelio.validators import StringValidator, ListValidator

from src.models.narrative_context_reference import NarrativeContextReference


@pymodelio_model
class NarrativeContext(NarrativeContextReference):
    _type: Attribute[str](validator=StringValidator())
    _name: Attribute[str](validator=StringValidator())
    _narrative_categories: Attribute[List[dict]](validator=ListValidator(elements_type=dict), default_factory=list)

    @property
    def type(self) -> str:
        return self._type

    @property
    def name(self) -> str:
        return self._name

    @property
    def narrative_categories(self) -> List[dict]:
        return self._narrative_categories

    @narrative_categories.setter
    def narrative_categories(self, narrative_categories: List[dict]) -> None:
        self._narrative_categories = narrative_categories
