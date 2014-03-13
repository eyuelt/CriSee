#Add the pygooglevoice directory to our PYTHONPATH so we
#can use the googlevoice module without installing it
import sys
sys.path.append("../python_modules/pygooglevoice-0.5")

from googlevoice import Voice
from googlevoice.util import input

voice = Voice();
voice.login();
"""
Email: criseeapp@gmail.com
Password: cs147crisee
"""

phoneNumber = input('Number to send message to: ');
text = input('Message to send: ');

voice.send_sms(phoneNumber, text);
