f = open('songs.js', 'r')
f2 = open('song2.js', 'w')
for line in f.readlines():
	n = line.replace(',', '":').strip('\n')
	f2.write('"' + n + ',' + '\n')
	