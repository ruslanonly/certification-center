import time

class RandomGenerator:
    def __init__(self):
        self.seed = time.time_ns()
        self.a = 6364136223846793005
        self.b = 1442695040888963407
        self.m = 2 ** 2048
        for i in range(10 ** 1):
            self.generate_random()

    def generate_random(self):
        self.seed = (self.a * self.seed + self.b) % self.m
        return self.seed

    def generate_random_int(self, mi, ma):
        return mi + self.generate_random() % (ma + 1 - mi)

    def generate_random_bits(self, n):
        bits = []
        rand_num = self.generate_random()
        for _ in range(n):
            bits.append(str(rand_num & 1))
            rand_num >>= 1
        return int(''.join(bits), 2)
