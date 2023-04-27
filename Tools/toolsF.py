from Cryptodome.Random import get_random_bytes

def randombyte():
    b = None
    while not b:
        b = get_random_bytes(1)
    return b