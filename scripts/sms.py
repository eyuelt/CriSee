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
