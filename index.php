<?php
$settingsDropdown = <<<EOT
    <div class="form-row">
        <label for="set-wpm-sel">Words per minute:</label>
        <select ng-model="settings.wpm" id="set-wpm-sel">
            <option value="200">100 WPM</option>
            <option value="200">150 WPM</option>
            <option value="200">200 WPM</option>
            <option value="250">250 WPM</option>
            <option value="300">300 WPM</option>
            <option value="350">350 WPM</option>
            <option value="400">400 WPM - Default speed</option>
            <option value="450">450 WPM</option>
            <option value="500">500 WPM</option>
            <option value="550">550 WPM</option>
            <option value="600">600 WPM</option>
            <option value="650">650 WPM</option>
            <option value="700">700 WPM</option>
            <option value="750">750 WPM</option>
            <option value="800">800 WPM</option>
        </select>
    </div>
    
    <div class="form-row">
        <div class="checkbox">
            <div class="check">
                <input ng-model="settings.pauseBetweenSentences" id="set-pause-sent-chk" type="checkbox">
                <span></span>
            </div>
            <label for="set-pause-sent-chk">Pause between sentences</label>
        </div>
    </div>
    
    <div class="form-group">
        <div class="form-row">
            <div class="checkbox">
                <div class="check">
                    <input ng-model="settings.centerFocusPoint" id="set-center-focus-point-chk" type="checkbox">
                    <span></span>
                </div>
                <label for="set-center-focus-point-chk">Center focus point</label>
            </div>
        </div>
        
        <div class="form-row {{ !settings.centerFocusPoint ? 'disabled' : '' }}">
            <div class="checkbox">
                <div class="check">
                    <input ng-model="settings.highlightFocusPoint" id="set-highlight-focus-point-chk" type="checkbox">
                    <span></span>
                </div>
                <label for="set-highlight-focus-point-chk">Highlight focus point</label>
            </div>
        </div>
    </div>
    
    <!--
    <div class="form-row">
        <div class="checkbox">
            <div class="check">
                <input ng-model="settings.nightMode" id="set-nm-chk" type="checkbox">
                <span></span>
            </div>
            <label for="set-nm-chk">Night mode</label>
        </div>
    </div>
    -->

    <div class="form-row">
        <div class="checkbox">
            <div class="check">
                <input ng-model="settings.enableMultiplier" id="set-enable-multiplier-chk" type="checkbox">
                <span></span>
            </div>
            <label for="set-enable-multiplier-chk" title="Slow down or speed up words based on their length.">Smart speed (?)</label>
        </div>
    </div>

    <div class="form-row">
        <div class="checkbox">
            <div class="check">
                <input ng-model="settings.useSerifFont" id="set-serifFont-chk" type="checkbox">
                <span></span>
            </div>
            <label for="set-serifFont-chk">Use Serif font style</label>
        </div>
    </div>
EOT;

$keyboardDropdown = <<<EOT
    <p>Here are some shortcuts for you!</p>
    <p><span class="key">space</span> to pause/continue</p>
    <p><span class="key">left</span> or <span class="key">a</span> for previous word</p>
    <p><span class="key">right</span> or <span class="key">d</span> for next word</p>
    <p><span class="key">ctrl+left</span> for previous sentence</p>
EOT;

$aboutDropdown = <<<EOT
    <p>What is this shit?</p>
EOT;

?><!doctype html>
<html class="no-js" lang="en" ng-app="speedReadingApp">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Champ | Speed read like a boss</title>
    <link rel="stylesheet" href="css/app.css" />
    
    <script src="js/modernizr.js"></script>
    <script>
        var base_url = '<?php $parsed = parse_url($_SERVER["REQUEST_URI"]); echo $parsed['path']; ?>';
    </script>
</head>
<body ng-controller="MainCtrl" class="{{ game.paused ? 'is-paused' : 'is-not-paused' }}
                                      {{ game.hasStarted ? 'has-started' : 'has-not-started' }}
                                      {{ settings.nightMode ? 'dark-mode' : 'bright-mode' }}
                                      {{ settings.highlightFocusPoint ? 'highlight-focus-point' : '' }}
                                      {{ settings.useSerifFont ? 'serif-font' : '' }}
                                      {{ settings.showLoadingOverlay ? 'is-loading' : '' }}
                                      {{ settings.init ? 'init' : '' }}
                                      {{ settings.centerFocusPoint ? 'center-focus-point' : '' }}">

    <div class="front">
        <div class="top-bar">
            <div class="inner-container">
                
                <div class="bar-item logo">
                    <h1>Champ - Speed read like a boss</h1>
                    <img class="logo" src="img/logox2.png" alt="Champ logo">
                </div>
                
                <div class="bar-item">
                    <a class="toolbar-button red" ng-click="startRead()">Start read <i class="fa fa-play"></i></a>
                </div>

                <div class="bar-item" ng-show="settings.toast">
                    <p>{{ settings.toast }}</p>
                </div>
                
                <div class="bar-item">
                    <a title="Show settings" class="toolbar-button opaque" toggle-dropdown="top-bar-drop-settings">Settings <i class="fa fa-gear"></i></a>
            
                    <div id="top-bar-drop-settings" class="dropdown">
                        <?php echo $settingsDropdown; ?>
                    </div>
                </div>
                
                <div class="bar-item">
                    <a title="Show settings" class="toolbar-button opaque" toggle-dropdown="about">About <i class="fa fa-question"></i></a>
            
                    <div id="about" class="dropdown">
                        <?php echo $aboutDropdown; ?>
                    </div>
                </div>

            </div> <!-- inner container -->
        </div> <!-- top bar -->

        <textarea ng-model="settings.text" class="editor mousetrap" placeholder="Paste text or URL here..." spellcheck=false ng-paste="formatPastedText($event)"></textarea>
    </div>
    
    <div class="read-canvas">
        <div class="inner-content">

            <div class="top-controls">
                <div class="left">
                    <a style="width: 132px;" class="icon-button outlined has-text right-spacing show-if-paused" ng-click="continueRead();" title="Continue"><i class="fa fa-play"></i>Continue</a>
                    <a style="width: 132px;" class="icon-button outlined has-text right-spacing show-if-not-paused" ng-click="pauseRead();" title="Pause"><i class="fa fa-pause"></i>Pause</a>

                    <a class="icon-button right-spacing" ng-click="goToPosition('last_sentence');" title="Previous sentence"><i class="fa fa-step-backward"></i></a>
                    <a class="icon-button right-spacing" ng-click="restartRead();" title="Restart"><i class="fa fa-undo"></i></a>
                    <a class="icon-button" ng-click="stopRead();" title="Stop"><i class="fa fa-stop"></i></a>
                </div>

                <div class="right">
                    <div class="relative">
                        <a class="icon-button outlined" title="Show keyboard shortcuts" data-toggle-dropdown="in-read-keyboard-dropdown"><i class="fa fa-keyboard-o"></i></a>
                
                        <div id="in-read-keyboard-dropdown" class="dropdown">
                            <?php echo $keyboardDropdown; ?>
                        </div>
                    </div>

                    <div class="relative">
                        <a class="icon-button outlined" title="Show settings" data-toggle-dropdown="in-read-drop-settings"><i class="fa fa-gear"></i></a>
                
                        <div id="in-read-drop-settings" class="dropdown">
                            <?php echo $settingsDropdown; ?>
                        </div>
                    </div>
                </div>

                <div class="center">
                    {{ game.percentComplete(true) }}% complete &nbsp;&nbsp;&nbsp;&nbsp; {{ game.timeToComplete() }} min
                </div>
            </div>

            <div class="word-container">
                <div class="focus-point">
                    <span class="before">{{ game.words[game.currentWord].raw.start | unsafe }}</span><!--
                    --><span class="{{ game.words[game.currentWord].raw.highlighted ? 'highlight' : '' }}">{{ game.words[game.currentWord].raw.highlighted | unsafe }}</span><!--
                    --><span class="special">{{ game.words[game.currentWord].raw.specialChar | unsafe }}</span><!--
                    --><span class="after">{{ game.words[game.currentWord].raw.end | unsafe }}</span>
                </div>

                <div id="countdown-bar" class="countdown-bar">
                    <div class="progress"></div>
                </div>
            </div>

            <div id="timeline" class="timeline">
                <div range-slider min="0" max="game.words.length < 1 ? 1 : (game.words.length-1)" model-max="game.currentWord" pin-handle="min" show-values="false"></div>
            </div>

        </div>
    </div>

    <div class="loading-screen">
        <div class="icon">Loading</div>
    </div>
    
    <!-- jQuery only used for range slider support -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.15/angular.min.js"></script>
    <script src="js/min/app.js"></script>
</body>
</html>