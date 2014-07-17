"""
Class used for defining and running Video acceptance test suite
"""
from bokchoy_suite import BokChoyTestSuite

try:
    from pygments.console import colorize
except ImportError:
    colorize = lambda color, text: text  # pylint: disable-msg=invalid-name

__test__ = False  # do not collect


class VideoTestSuite(BokChoyTestSuite):
    """
    TestSuite for running Bok Choy tests
    """
    def __init__(self, *args, **kwargs):
        super(VideoTestSuite, self).__init__(*args, **kwargs)