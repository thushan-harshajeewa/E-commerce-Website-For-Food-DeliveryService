# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class OrderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def update_order_status(self, event):
        status = event['status']

        # Send order status to the frontend
        await self.send(text_data=json.dumps({
            'status': status,
        }))
