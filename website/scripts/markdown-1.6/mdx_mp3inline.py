import re, markdown, random

class Mp3InlinePreprocessor(markdown.Preprocessor):

    """
       Replaces underlined headers with hashed headers to avoid
       the nead for lookahead later.
    """

    MP3_PATTERN = re.compile(r"""
    ^                   # Beginning of the line
    (.*)                # Whatever you want
    {{([\w-]+)}}        # MP3 link
    (.*)                # Whatever you want
    """, re.VERBOSE)


    MP3_CODE = \
    '<object type="application/x-shockwave-flash"' \
    'data="/musicplayer.swf?song_url=%s"' \
    'width="17" height="17">' \
    '<param name="movie"' \
    'value="/musicplayer.swf?song_url=%s" />' \
    '<img src="noflash.gif"' \
    'width="17" height="17" alt="" />' \
    '</object>'

    MP3_CODE_LARGE = \
    '<object type="application/x-shockwave-flash"' \
    'data="/audio/player.swf" id="audioplayer%d"' \
    'height="24" width="290">' \
    '<param name="movie"' \
    'value="/audio/player.swf">' \
    '<param name="FlashVars" value="playerID=%d&amp;soundFile=%s">' \
    '<param name="quality" value="high">' \
    '<param name="menu" value="false">' \
    '<param name="wmode" value="transparent">' \
    '</object>'

    def __init__(self, extension):
        self.songid = 1
        self.extension = extension

    def run (self, lines) :
        urls = self.extension.md_globals['REFERENCE_PREPROCESSOR'].references
        for i,line in enumerate(lines):
            match = self.MP3_PATTERN.match(line)
            if match is not None:
                key = match.group(2)
                try:
                    url = urls[key][0]
                    # mp3_code = self.MP3_CODE % (url, url)
                    mp3_code = self.MP3_CODE_LARGE % (self.songid, self.songid, url)
                    self.songid += 1
                    line = match.group(1) + mp3_code + match.group(3)
                    lines[i] = line
                except KeyError:
                    pass
            pass
        return lines


class Mp3InlineExtension(markdown.Extension):

    def __init__ (self, configs) :
        pass

    def extendMarkdown(self, md, md_globals) :
        self.md = md
        self.md_globals = md_globals
        md.preprocessors.append(Mp3InlinePreprocessor(self))


def makeExtension(configs=None) :
    return Mp3InlineExtension(configs=None)
