<?php
namespace markdrzy\importable;

use Craft;
use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

class ImportableAssets extends AssetBundle
{
  public function init()
  {
    $this->sourcePath = '@markdrzy/importable/resources';

    $this->depends = [
      CpAsset::class,
    ];

    $this->js = [
      'node_modules/papaparse/papaparse.min.js',
      'js/importable.js',
    ];

    $this->css = [
      'css/importable.css',
    ];

    parent::init();
  }
}
