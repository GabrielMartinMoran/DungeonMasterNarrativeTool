from src.utils import hashing

raw_password = input('Password to hash: ')
print(f'Hashed password: {hashing.hash_password(raw_password)}')
