import sys
from mcstatus import MinecraftServer

server = MinecraftServer('minecraft.baffqd.com', 25565)

status = server.status()

print(status.players.online, end='')
sys.stdout.flush()