CEC_URL = 'https://www.washington.edu/cec/toc.html'
CACHE = 'cache/'

# Username and password are read from params.init in the same file directory
# Format should be 'username,password' with a new line at the end
with open('params.csv', 'r') as f:
    login_info = [line.split(',') for line in f.read().splitlines()]
    USERNAME = login_info[0][0]
    PASSWORD = login_info[0][1]
