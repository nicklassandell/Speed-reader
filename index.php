<!doctype html>
<html class="no-js" lang="en" ng-app="speedReadingApp">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Speed read</title>
    <link rel="stylesheet" href="stylesheets/app.css" />

    <script>
        var base_url = '<?php $parsed = parse_url($_SERVER["REQUEST_URI"]); echo $parsed['path']; ?>';
    </script>
</head>
<body ng-controller="MainCtrl" class="{{ game.paused ? 'is-paused' : 'is-not-paused' }}
                                      {{ game.has_started ? 'has-started' : 'has-not-started' }}
                                      {{ !settings.night_mode ? 'bright-mode' : '' }}
                                      {{ settings.highlight_focus_point ? 'highlight-focus-point' : '' }}
                                      {{ settings.sleep ? 'is-sleeping' : 'is-not-sleeping' }} ">

    <div class="top-bar">
        <div class="inner-container">
            
            <div class="bar-item">
                <h1>Speed read</h1>
            </div>
            
            <div class="bar-item show-if-not-started">
                <button class="green" ng-click="startRead()">Start read <i class="fa fa-play"></i></button>
            </div>

            <div class="bar-item show-if-not-started">
                <p id="status-text">{{ settings.toast }}</p>
            </div>

            <div class="bar-item small-gap show-if-paused">
                <button style="width: 130px;" ng-click="continueRead()">Continue <i class="fa fa-play"></i></button>
            </div>

            <div class="bar-item small-gap show-if-not-paused">
                <button style="width: 130px;" class="show-if-running" ng-click="pauseRead()">Pause <i class="fa fa-pause"></i></button>
            </div>

            <div class="bar-item show-if-started">
                <button class="dark" ng-click="stopRead()">Stop <i class="fa fa-stop"></i></button>
            </div>
            
            <div class="bar-item right">
                <button class="dark" toggle-dropdown="drop-settings">Settings <i class="fa fa-angle-down"></i></button>
        
                <div id="drop-settings" class="dropdown">
                    <div class="form-row">
                        <label for="set-wpm-sel">Words per minute:</label>
                        <select ng-model="settings.wpm" id="set-wpm-sel" save-on-change>
                            <option value="200">100 WPM</option>
                            <option value="200">150 WPM</option>
                            <option value="200">200 WPM</option>
                            <option value="250">250 WPM</option>
                            <option value="300">300 WPM - Default speed</option>
                            <option value="350">350 WPM</option>
                            <option value="400">400 WPM</option>
                            <option value="450">450 WPM</option>
                            <option value="500">500 WPM</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="checkbox">
                            <div class="check">
                                <input ng-model="settings.pause_between_sentences" id="set-pause-sent-chk" type="checkbox" save-on-change>
                                <span></span>
                            </div>
                            <label for="set-pause-sent-chk">Pause between sentences</label>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="checkbox">
                            <div class="check">
                                <input ng-model="settings.highlight_focus_point" id="set-highlight-focus-point-chk" type="checkbox" save-on-change>
                                <span></span>
                            </div>
                            <label for="set-highlight-focus-point-chk">Highlight focus point</label>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="checkbox">
                            <div class="check">
                                <input ng-model="settings.night_mode" id="set-nm-chk" type="checkbox" save-on-change>
                                <span></span>
                            </div>
                            <label for="set-nm-chk">Night mode</label>
                        </div>
                    </div>

                </div> <!-- drop settings -->
            </div>

        </div> <!-- inner container -->
    </div> <!-- top bar -->

    <textarea ng-model="settings.text" class="editor" placeholder="Paste text or URL here..." spellcheck=false ng-paste="formatPastedText($event)" save-on-change <?php if(!empty($_REQUEST['text'])) : ?> ng-init="settings.text='<?php echo htmlspecialchars($_REQUEST['text']); ?>'; startRead();" <?php endif; ?> ></textarea>
    
    <div class="word-canvas" ng-click="pauseRead()">
        <div class="word-container">
            <div class="center-point">
                <span class="before">{{ game.words[game.currentWord].raw.start | unsafe }}</span>
                <span class="{{ game.words[game.currentWord].raw.highlighted ? 'highlight' : '' }}">{{ game.words[game.currentWord].raw.highlighted | unsafe }}</span>
                <span class="special">{{ game.words[game.currentWord].raw.specialChar | unsafe }}</span>
                <span class="after">{{ game.words[game.currentWord].raw.end | unsafe }}</span>
            </div>
        </div>
        <div class="paused-screen">
            <p class="big">{{ game.percentComplete(true) }}% complete.</p>
            <p>
                <button class="right-spacing" ng-click="continueRead(); $event.stopPropagation();">Continue <i class="fa fa-play"></i></button>
                <button class="right-spacing dark" ng-click="goToPosition('last_sentence'); $event.stopPropagation();">Last sentence <i class="fa fa-step-backward"></i></button>
                <button class="dark" ng-click="restartRead(); $event.stopPropagation();">Restart <i class="fa fa-undo"></i></button>
            </p>
        </div>

        <div id="timeline" class="timeline">
            <div range-slider min="0" max="game.words.length" model-max="game.currentWord" pin-handle="min" show-values="false"></div>
        </div>
    </div>
    
    <!-- jQuery only used for range slider support -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.15/angular.min.js"></script>
    <script src="js/angular.rangeSlider.js"></script>
    <script src="js/app.js"></script>
</body>
</html>