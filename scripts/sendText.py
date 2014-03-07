import pexpect
import sys
import os

def main(number, message):
  currfilearr = os.path.abspath(__file__).split("/");
  currfilearr[-1] = "sms.py";
  scriptfilename = "/".join(currfilearr);

  child = pexpect.spawn("python " + scriptfilename);
  child.expect("Email address:");
  child.sendline("criseeapp@gmail.com");
  child.expect("Password:");
  child.sendline("cs147crisee");
  child.expect("Number to send message to:");
  child.sendline(number);
  child.expect("Message to send:");
  child.sendline(message);


if __name__ == "__main__":
  if len(sys.argv) != 3:
    print "Usage: sendText.py [number] [message]";
    sys.exit(0);
  number = sys.argv[1];
  message = sys.argv[2];
  main(number, message);
