from pymodelio import pymodelio_model, Attribute
from pymodelio.validators import StringValidator


@pymodelio_model
class NarrativeContextReference:
    _narrative_context_id: Attribute[str](validator=StringValidator())
    _username: Attribute[str](validator=StringValidator())

    @property
    def narrative_context_id(self) -> str:
        return self._narrative_context_id

    @property
    def username(self) -> str:
        return self._username
