#!/usr/bin/env python2.7

# $Id: generate-website.py,v 1.6 2007/01/12 03:29:02 me Exp $

import sys
import os
import stat
import datetime
import argparse
from string import Template

sys.path.append('.')
import content.config

os.umask(022)

CONTENT_DIR = 'content'

def parse_args():
    parser = argparse.ArgumentParser(description='Generate Korvai.org site for deployment')
    parser.add_argument('--destination', '-d', required=True,
                        help='the destination directory to write to (will be created)')
    args = parser.parse_args()
    return args


def getMtime(f):
    """The time of modification of a file"""
    try:
        t = os.stat(f)[stat.ST_MTIME]
    except OSError:
        t = 0
    return t

def newer(file1, file2):
    """Is file 1 newer than file 2."""
    t1 = getMtime(file1)
    t2 = getMtime(file2)
    return t1 > t2

def execute_cmd(cmd):
    print cmd
    os.system(cmd)

def gzip_file(filename):
    cmd = 'cat %(filename)s | gzip --best > %(filename)s.gz' % { 'filename': filename }
    execute_cmd(cmd)

def do_all(OUT_DIR):
    print "\nCreating HTML files"
    for filename,title in content.config.markdown_pages:
        dirname = os.path.dirname(filename)
        basename, ext = os.path.splitext(filename)
        assert (ext == '.txt')
        htmldirname = os.path.join(OUT_DIR, dirname)
        htmlfilename = os.path.join(OUT_DIR, '%s.html' % basename)
        if not os.path.isdir(htmldirname):
            os.mkdir(htmldirname)
        markdownfilename = '%s/%s' % (CONTENT_DIR, filename)
        if not os.path.exists(markdownfilename):
            raise IOError("File does not exist: '%s'" % markdownfilename)
        if not newer(markdownfilename, htmlfilename):
            continue
        print '%s/%s' % (CONTENT_DIR, filename)
        # cmd = 'scripts/Markdown.pl < %s/%s' % (CONTENT_DIR, filename)
        cmd = 'scripts/markdown-1.6/markdown.py -x mp3inline %s' % markdownfilename
        page_content = os.popen(cmd, 'r').read()
        t = Template(content.config.template)
        html_code = t.substitute(content=page_content, title=title, date=datetime.datetime.now())
        open(htmlfilename, 'w').write(html_code)
        gzip_file(htmlfilename)

    print "\nCopying static files"
    for filename in content.config.static_pages:
        dirname = os.path.dirname(filename)
        htmldirname = os.path.join(OUT_DIR, dirname)
        htmlfilename = os.path.join(OUT_DIR, filename)
        markdownfilename = '%s/%s' % (CONTENT_DIR, filename)
        if not os.path.exists(markdownfilename):
            raise IOError("File does not exist: '%s'" % markdownfilename)
        if not os.path.isdir(htmldirname):
            os.mkdir(htmldirname)
        if not newer(markdownfilename, htmlfilename):
            continue
        cmd = 'cp %s %s' % (markdownfilename, htmlfilename)
        print cmd
        os.system(cmd)
        gzip_file(htmlfilename)

    print "\nExtracting gzip files"
    for filename in content.config.tgz_files:
        dirname = os.path.dirname(filename)
        htmldirname = os.path.join(OUT_DIR, dirname)
        gzipfilename = '%s/%s' % (CONTENT_DIR, filename)
        if not os.path.isdir(htmldirname):
            os.mkdir(htmldirname)
        cmd = 'tar -zxvf %s -C %s' % (gzipfilename, htmldirname)
        print cmd
        os.system(cmd)

    cmd = 'chmod -Rc g+rwX,o+rX %s' % OUT_DIR
    execute_cmd(cmd)

args = parse_args()
do_all(args.destination)

# vim:ts=4:sw=4:et:
