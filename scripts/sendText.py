#Add the pygooglevoice directory to our PYTHONPATH so we
#can use the googlevoice module without installing it
import sys
sys.path.append("python_modules/pygooglevoice-0.5")

from googlevoice import Voice
from googlevoice.util import input

def main(number, message):
  voice = Voice();

  email = 'criseeapp@gmail.com';
  password = 'cs147crisee';
  voice.login(email, password);

  voice.send_sms(number, message);


if __name__ == "__main__":
  if len(sys.argv) != 3:
    print "Usage: sendText.py [number] [message]";
    sys.exit(0);
  number = sys.argv[1];
  message = sys.argv[2];
  main(number, message);
