import mechanize, cookielib, multiprocessing
from os import listdir
from urllib2 import HTTPError

CEC_URL = 'https://www.washington.edu/cec/toc.html'
CACHE = 'cache/'
JS_WARNING = 'You do not have Javascript turned on'
VALID_CATALOG_PAGE = '^[a-zA-Z]-toc.html$'
VALID_COURSE_ENTRY_PAGE = '^[a-zA-Z]\/.*.html$'

# Username and password are read from params.init in the same file directory
# Format should be 'username,password' with a new line at the end
with open('params.csv', 'r') as f:
    login_info = [line.split(',') for line in f.read().splitlines()]
    USERNAME = login_info[0][0]
    PASSWORD = login_info[0][1]


def init_browser():
    browser = mechanize.Browser()
    cookies = cookielib.LWPCookieJar()
    browser.set_cookiejar(cookies)
    browser.set_handle_equiv(True)
    browser.set_handle_redirect(True)
    browser.set_handle_referer(True)
    browser.set_handle_robots(False)
    return browser


def js_warning_page(browser):
    while JS_WARNING in browser.response().read():
        # Click the ok button and continue
        try:
            browser.select_form(nr = 0)
            browser.submit()
        except HTTPError as e:
            return False

    return True


def login(browser):
    browser.open(CEC_URL)
    js_warning_page(browser)

    # Login to UW NET ID
    browser.select_form(nr=0)
    browser.form['user'] = USERNAME
    browser.form['pass'] = PASSWORD
    browser.submit()

    js_warning_page(browser)


def process_course(browser, course, base_url, cache):
    course_page_id = course[2:]
    if course_page_id not in cache:
        try:
            browser.open(course)
        except:
            # print 'Open fail', course_page_id
            return False

        if js_warning_page(browser):
            response = browser.response().read()
            with open(CACHE + course_page_id, 'w') as f:
                f.write(response)

            cache.add(course_page_id)
            return True
        else:
            # print 'Write fail', course_page_id
            return False

    return False


def process_catalog(url):
    # Need a new browser since this will be done in parallel
    browser = init_browser()
    login(browser)

    # Open the catalog and grab all of the course links
    browser.open(url, timeout = 1.0)
    courses = [link.url for link in browser.links(url_regex = VALID_COURSE_ENTRY_PAGE)]
    base_url = browser.geturl()

    cache = set(listdir(CACHE))
    total = 0
    for i, course in enumerate(courses):
        added = process_course(browser, course, base_url, cache)
        if added:
            total += 1

        if i % 100 == 0 and i != 0:
            ratio = float(i) / len(courses)
            print url, "%.2f" % ratio, 'Done'


        browser.open(base_url)

    print 'Finished (' + str(total) + '):', url


def main():
    # Set up the browser
    browser = init_browser()
    login(browser)

    # All departments (by first letter)
    catalog_pages = [link.url for link in browser.links(url_regex = VALID_CATALOG_PAGE)]

    processes = []
    for catalog in catalog_pages:
        process = multiprocessing.Process(target = process_catalog, args = (catalog,))
        processes.append(process)
        process.start()

    for process in processes:
        process.join()


if __name__ == "__main__":
    main()
