<html>
  <head>
    <title>Update site from: GitHub master</title>
  </head>
<body>
<?php `echo ================================== >> gitFetchSite.log`; ?>
<?php `date >> gitFetchSite.log`; ?>
  <pre><?php echo `git fetch origin`; ?></pre>
  <pre><?php echo `git checkout origin/master -f`; ?></pre>
  <pre><?php echo `git status`; ?></pre>
  <pre><?php echo `git log -n1`; ?></pre>
  <pre><?php echo `npm install`; ?></pre>
  <pre><?php echo `bower install`; ?></pre>
  <pre><?php echo `grunt build`; ?></pre>
  <?php `git log -n1 >> gitFetchSite.log`; ?>
</body>
</html>
