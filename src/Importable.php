<?php
/**
 * Importable plugin for Craft CMS 3.x
 *
 * Add CSV data import functionality to the native Table fieldtype.
 *
 * @link      https://clickrain.com/about/mark-drzycimski
 * @copyright Copyright (c) 2017 Mark Drzycimski
 */

namespace markdrzy\importable;


use Craft;
use craft\base\Plugin;
use craft\services\Plugins;
use craft\events\PluginEvent;

use yii\base\Event;

/**
 * @author    Mark Drzycimski
 * @package   Importable
 * @since     1.0.0
 *
 */
class Importable extends Plugin
{
    // Static Properties
    // =========================================================================

    /**
     * Static property that is an instance of this plugin class so that it can be accessed via
     * Importable::$plugin
     *
     * @var Importable
     */
    public static $plugin;

    // Public Methods
    // =========================================================================

    public function init()
    {
        parent::init();
        self::$plugin = $this;

        // Load Asset Bundle
        Craft::$app->getView()->registerAssetBundle(ImportableAssets::class);
        Craft::$app->getView()->registerJs('Craft.importablePlugin.init({});');

        Craft::info(
            Craft::t(
                'importable',
                '{name} plugin loaded',
                ['name' => $this->name]
            ),
            __METHOD__
        );
    }
}
