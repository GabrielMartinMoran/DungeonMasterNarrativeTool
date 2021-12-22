import datetime
import random
import hashlib


class IdGenerator:
    _UNIQUE_ID_BASE_LENGTH = 40
    _UNIQUE_ID_IDENTIFIER = '00'
    _TIMESTAMP_MULTIPLIER = 1000000
    _HASH_ALGORITHM_VERSION = 0

    @staticmethod
    def generate_id(key: str) -> str:
        """
        Generates an id from provided key using a hash algorithm and appending configured hash_algorithm_version (as an
        length 2 hexadecimal string) to the end of the hash
        """
        key_bytes = key.encode('utf-8')
        return hashlib.sha1(key_bytes).hexdigest() + IdGenerator._get_hex_id_version()

    @staticmethod
    def generate_unique_id() -> str:
        """
        Generates a unique hexadecimal id with '00' as the last two characters of the string to help identifying that
        this method was used to generate the id
        """
        return IdGenerator._generate_unique_hash(IdGenerator._UNIQUE_ID_BASE_LENGTH) + IdGenerator._UNIQUE_ID_IDENTIFIER

    @staticmethod
    def _get_hex_id_version() -> str:
        int_version = IdGenerator._HASH_ALGORITHM_VERSION
        hex_version = IdGenerator._int_to_hex_str(int_version)
        return hex_version.rjust(2, '0')

    @staticmethod
    def _get_hex_timestamp() -> str:
        timestamp = datetime.datetime.now(datetime.timezone.utc).timestamp()
        full_int_timestamp = int(timestamp * IdGenerator._TIMESTAMP_MULTIPLIER)
        return IdGenerator._int_to_hex_str(full_int_timestamp)

    @staticmethod
    def _get_random_id(size: int) -> str:
        hex_chars = [IdGenerator._int_to_hex_str(x) for x in range(0, 16)]
        result = ''
        for x in range(size):
            result += random.choice(hex_chars)
        return result

    @staticmethod
    def _generate_unique_hash(size: int) -> str:
        hex_time_id = IdGenerator._get_hex_timestamp()
        random_id = IdGenerator._get_random_id(size - len(hex_time_id))
        result_id = hex_time_id + random_id
        return result_id[:size]

    @staticmethod
    def _int_to_hex_str(value: int) -> str:
        # [2:] to remove 0x after hex casting
        return str(hex(value))[2:]
