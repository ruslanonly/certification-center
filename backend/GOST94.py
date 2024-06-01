from gost_utils import RandomGenerator


class ESignature:

    def __init__(self, p=None, q=None, a=None, x=None, y=None):
        self.checks = []
        self.rand = RandomGenerator()
        if not (p and q and a and x and y):
            self.generate_keys()
        else:
            self.p = int(p)
            self.q = int(q)
            self.a = int(a)
            self.x = int(x)
            self.y = int(y)

    def generate_keys(self):
        self.generate_prime_factors()
        self.choose_a()
        self.choose_x()
        self.choose_y()

    def generate_prime_factors(self):
        k = self.rand.generate_random_int(2 ** 256, 2 ** 258)
        # k = random.randrange(2 ** 256, 2 ** 258)
        q = self.getLowLevelPrime(256)
        p = (k * q) + 1
        while not self.is_prime(p):
            # k = random.randrange(2 ** 256, 2 ** 258)
            k = self.rand.generate_random_int(2 ** 256, 2 ** 258)
            q = self.getLowLevelPrime(256)
            while not self.is_prime(q):
                q = self.getLowLevelPrime(256)
            p = (k * q) + 1

        self.p = p
        self.q = q

    def choose_a(self):
        g = 2
        while True:
            if pow(g, (self.p - 1) // self.q, self.p) != 1:
                self.a = pow(g, (self.p - 1) // self.q, self.p)
                return
            g += 1

    def choose_x(self):
        # self.x = random.randrange(0, self.q)
        self.x = self.rand.generate_random_int(0, self.q)

    def choose_y(self):
        self.y = pow(self.a, self.x, self.p)

    def verify_keys(self):
        print("q is prime", self.is_prime(self.q))
        print("p is prime", self.is_prime(self.p))
        print("q mod (p-1) == 0", (self.p - 1) % self.q == 0)
        print("a^q mod p == 1", pow(self.a, self.q, self.p) == 1)

    def __repr__(self):
        return f"KEY:\np = {self.p}\nq = {self.q}\na = {self.a}\nx = {self.x}\ny = {self.y}\n"

    def is_prime_fermat(self, n, k=10):
        checks = []
        if n <= 1:
            return False, checks
        if n <= 3:
            return True, checks

        for _ in range(k):
            a = self.rand.generate_random_int(2, n - 2)
            checks.append(f"Ферма с n={a}\n")
            if pow(a, n - 1, n) != 1:
                return False, checks
        return True, checks

    def miller_rabin(self, n, k=40):
        checks = []
        if n == 2 or n == 3:
            return True, ["Миллер-Рабин с n=2", "Миллер-Рабин с n=3"]
        if n <= 1 or n % 2 == 0:
            return False, ["Миллер-Рабин с n=2"]

        s, r = 0, n - 1
        while r % 2 == 0:
            s += 1
            r //= 2

        for _ in range(k):
            a = self.rand.generate_random_int(2, n - 1)
            checks.append(f"Миллер-Рабин с n={a}\n")
            x = pow(a, r, n)
            if x != 1 and x != n - 1:
                j = 1
                while j < s and x != n - 1:
                    x = pow(x, 2, n)

                    if x == 1:
                        return False, checks
                    j += 1
                if x != n - 1:
                    return False, checks
        return True, checks

    def is_prime(self, number):
        is_fermat_prime, fermat_checks = self.is_prime_fermat(number)
        is_miller_prime, miller_checks = self.miller_rabin(number)
        self.checks = fermat_checks + miller_checks
        return is_miller_prime and is_miller_prime

    @staticmethod
    def simple_hash(message):
        seed = 0xABCDEF

        def pseudo_random_generator(input_val):
            mask = 0xFFFFFFFFFFFFFFFF
            temp = (input_val * 0xABCDEF123456789) & mask
            return temp

        hash_val = seed
        for char in message:
            char_code = ord(char)
            hash_val ^= pseudo_random_generator(char_code)

        final_hash = ""
        for _ in range(64):
            hash_val = pseudo_random_generator(hash_val)
            final_hash += format(hash_val & 0xF, 'x')
            hash_val >>= 4

        return int(final_hash, 16)

    first_primes_list = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
                         31, 37, 41, 43, 47, 53, 59, 61, 67,
                         71, 73, 79, 83, 89, 97, 101, 103,
                         107, 109, 113, 127, 131, 137, 139,
                         149, 151, 157, 163, 167, 173, 179,
                         181, 191, 193, 197, 199, 211, 223,
                         227, 229, 233, 239, 241, 251, 257,
                         263, 269, 271, 277, 281, 283, 293,
                         307, 311, 313, 317, 331, 337, 347, 349]

    def nBitRandom(self, n):
        # return random.randrange(2 ** (n - 1) + 1, 2 ** n - 1)
        return self.rand.generate_random_int(2 ** (n - 1) + 1, 2 ** n - 1)

    def getLowLevelPrime(self, n):
        while True:
            pc = self.nBitRandom(n)

            for divisor in self.first_primes_list:
                if pc % divisor == 0 and divisor ** 2 <= pc:
                    break
            else:
                return pc

    def sign_message(self, message):
        print(message)
        h = self.simple_hash(message)
        # k = random.randrange(0, self.q)
        k = self.rand.generate_random_int(0, self.q)
        w1 = pow(self.a, k, self.p)
        w2 = w1 % self.q
        while w2 == 0:
            # k = random.randrange(0, self.q)
            k = self.rand.generate_random_int(0, self.q)
            w1 = pow(self.a, k, self.p)
            w2 = w1 % self.q
        s = (self.x * w2 + k * h) % self.q
        while s == 0:
            # k = random.randrange(0, self.q)
            k = self.rand.generate_random_int(0, self.q)
            w1 = pow(self.a, k, self.p)
            w2 = w1 % self.q
            while w2 == 0:
                # k = random.randrange(0, self.q)
                k = self.rand.generate_random_int(0, self.q)
                w1 = pow(self.a, k, self.p)
                w2 = w1 % self.q
            s = (self.x * w2 + k * h) % self.q
        return h, w2, s

    def get_public_keys_object(self):
        return {
            "p": str(self.p),
            "q": str(self.q),
            "a": str(self.a),
            "y": str(self.y)
        }

    def get_private_keys_object(self):
        return {
            "x": str(self.x)
        }

    @staticmethod
    def verify_signature(message, w2, s, p, q, a, y):
        print(message)
        h2 = ESignature.simple_hash(message)
        v = pow(h2, q - 2, q)
        z1 = (s * v) % q
        z2 = ((q - w2) * v) % q
        u = (pow(a, z1, p) * pow(y, z2, p) % p) % q
        return h2, u == w2


if __name__ == '__main__':
    sig = ESignature()
    print(sig)
    sig.verify_keys()
    print(sig.checks)

    sig2 = ESignature(sig.p, sig.q, sig.a, sig.x, sig.y)
    print(sig2)
    sig2.verify_keys()
    print(sig2.checks)

    w2, s = sig2.sign_message("HELLO WORLD")
    isCorrect = ESignature.verify_signature("HELLO WORLD", w2, s, sig.p, sig.q, sig.a, sig.y)
    print(isCorrect)

    # test_vals = {
    #     "w2": 6349539709364653983048897950249712879479610820356266389080778538409191116989,
    #     "s": 18480760626425742422115865600978483898304131744956427966271438677478166923374,
    #     "q": 67604623842990158825207839480547541282778806074339556853021731319192361810369,
    #     "p": 8487935632996776567822848120692835386774083352196098638699175004563205314184834742437161820191127622856374881395754507296154023248188186929073402149449601,
    #     "a": 3844011359607141828358813302360570844209788411107345216615818278731245988492799459993028810880515178898207728825662747587221996005735301502709216328870155,
    #     "x": 53019578035003108991544554621595145768971842558293599653692089118317273964438,
    #     "y": 7997155236111534249777951215922588715952276211164119000928626380962958428014316487731989147530498909225052254045628918287692253799182102028753719764369542,
    #     "message": "Hello World"
    # }
    # sig = ESignature(test_vals["p"], test_vals["q"], test_vals["a"], test_vals["x"], test_vals["y"])
    # print(sig.sign_message(test_vals["message"]))
    # isCorrect = ESignature.verify_signature(test_vals["message"], test_vals["w2"], test_vals["s"], sig.p, sig.q, sig.a, sig.y)
    # print(isCorrect)
