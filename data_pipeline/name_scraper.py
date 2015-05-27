import mechanize, cookielib, multiprocessing, re
from bs4 import BeautifulSoup


NAME_URL = 'https://www.washington.edu/students/crscat/'


def init_browser():
    browser = mechanize.Browser()
    cookies = cookielib.LWPCookieJar()
    browser.set_cookiejar(cookies)
    browser.set_handle_equiv(True)
    browser.set_handle_redirect(True)
    browser.set_handle_referer(True)
    browser.set_handle_robots(False)
    return browser


def process_dep(browser, dep):
    browser.open(dep)
    processed = set()
    soup = BeautifulSoup(browser.response().read(), 'lxml')
    for tag in soup.findAll(lambda tag : tag.name == 'a' and 'name' in tag.attrs):
        header = tag.find('b').getText()
        optional_profs = tag.find('i')
        description = tag.getText().replace(header, '').replace(';', ',')

        if optional_profs:
            description = description.replace(optional_profs.getText(), '')

        if 'View course details in MyPlan' in description:
            description = description[:description.index('View course details in MyPlan')]


        course_code = tag.attrs['name']
        header = header[re.search('[0-9]{3}', header).start() + 4:header.index('(') - 1]
        header = ' '.join(header.split())
        description = ' '.join(description.split())

        if course_code not in processed:
            print course_code + ';' + header + ';' + description
            processed.add(course_code)


def main():
    browser = init_browser()
    browser.open(NAME_URL)

    departments = [link.url for link in browser.links() if '#' not in link.url and '/' not in link.url]
    catalog_url = browser.geturl()

    for dep in departments:
        process_dep(browser, dep)
        browser.open(catalog_url)


if __name__ == "__main__":
    main()
