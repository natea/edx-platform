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
        self.num_times = int(kwargs.get('num_times', 1))

    def run_suite_tests(self):
        """
        Runs each of the suites in self.subsuites while tracking failures for the specified number of times
        """
        # Uses __enter__ and __exit__ for context
        with self:
            # run the tests for this class, and for all subsuites
            for count in range(self.num_times):
                if self.cmd:
                    passed = self.run_test()
                    if not passed:
                        self.failed_suites.append(self)

                for suite in self.subsuites:
                    suite.run_suite_tests()
                    if len(suite.failed_suites) > 0:
                        self.failed_suites.extend(suite.failed_suites)