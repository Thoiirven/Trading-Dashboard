import asyncio
from telegram import Bot

class Telegram_bot:

	def __init__(self):
		self.token = "6939990457:AAGFQFEJof75cGpVYGUb2OjonOFBnH0RqFY" 
		self.chat_id = -4041673428

	async def send_telegram_message_async(self, message):
	    bot_token = self.token
	    target_chat_id = self.chat_id

	    # Create instance of bot
	    bot = Bot(token=bot_token)

	    # use send_message method to send message
	    await bot.send_message(chat_id=target_chat_id, text=message)

	def sent_message(self, message):
		# To execut async loop
		loop = asyncio.get_event_loop()
		loop.run_until_complete(self.send_telegram_message_async(message))