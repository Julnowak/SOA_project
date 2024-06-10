import os
import subprocess
import time
import argparse


# Global list to keep track of subprocesses
processes = []

def open_new_terminal(command):
    # Open a new terminal and run the command
    process = subprocess.Popen(["start", "cmd", "/k", command], shell=True)
    processes.append(process)

def open_browser(browser, url):
    if browser.lower() == "chrome":
        subprocess.Popen(["start", "chrome", "--incognito", url], shell=True)
    elif browser.lower() == "firefox":
        subprocess.Popen(["start", "firefox", "--private-window", url], shell=True)
    elif browser.lower() == "edge":
        subprocess.Popen(["start", "msedge", "--inprivate", url], shell=True)
    else:
        print(f"Unsupported browser: {browser}. Please use 'chrome', 'firefox', or 'edge'.")


def main(browser):
    # Define commands
    commands = [
        ("cd products_service && python manage.py runserver 8000", "Run products_service on port 8000"),
        ("cd users_service && python manage.py runserver 8001", "Run users_service on port 8001"),
        ("cd chat_service && python manage.py runserver 8002", "Run chat_service on port 8002"),
        ("cd users_service && python manage.py shell -c \"exec(open('users/consumer.py').read())\"", "Run users_service consumer.py"),
    ]

    # Open terminals and run commands
    for command, description in commands:
        print(f"Executing: {description}")
        open_new_terminal(command)
        time.sleep(1)  # Slight delay to ensure terminals open sequentially

    # Start Docker Desktop
    subprocess.Popen(["C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"])  # Adjust path if necessary

    # Wait for Docker to start
    print("Waiting for Docker to start...")
    time.sleep(10)

    # Run Redis container
    print("Starting Redis container...")
    open_new_terminal("docker run --rm -p 6379:6379 redis:7")

    # Start the frontend
    print("Starting frontend application...")
    open_new_terminal("cd sr_app_front && npm start")

    # Wait a bit for the frontend to start
    time.sleep(5)

    # Open the browser in incognito mode
    print(f"Opening {browser} in incognito mode...")
    open_browser(browser, "http://localhost:3000")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run application services and open the browser.')
    parser.add_argument('--browser', type=str, required=True, help='Browser to use (chrome, firefox, edge)')
    args = parser.parse_args()
    main(args.browser)
