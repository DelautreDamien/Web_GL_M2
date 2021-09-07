<html>

<head>
    <meta charset="UTF-8">
    <title>WebGL - Canvas test</title>
    <meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">

    <!------------------------------------------------------------------->
    <script type="text/javascript" src="glMatrix.js"></script>
    <script type="text/javascript" src="callbacks.js"></script>
    <script type="text/javascript" src="glCourseBasis.js"></script>
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

    <style type="text/CSS">
        #contenu1 {
            margin-left:0px;
            float:left;
        }

        #contenu2 {
            margin-left:50px;
            float:left;
            width:600px;
            height:600px;
            text-align:center;
        }

        #custom-handle, #custom-handle2, #custom-handle3, #custom-handle4 {
            width: 2em;
            height: 1.5em;
            text-align: center;
            line-height: 1.5em;
            border-radius: 5px;
        }

        #colorWell {
            border-radius: 0.25rem;
            color: #007bff;
            border: 1px solid transparent;
            padding: 0.3rem 0.3rem;
            width: 5em;
            height : 2em;
        }

        .ui-widget {
            border: 1px solid #c5c5c5;
            font-family: Arial,Helvetica,sans-serif;
            font-size: 0.9em;
        }

        .ui-widget-content {
            border: 1px solid #dddddd;
            background: #ffffff;
            color: #333333;
        }

        .ui-sliderSlider-horizontal {
            height: .8em;
        }

        .ui-sliderSlider {
            position: relative;
            margin: 5px 25px;
            height: 1em;
            background-color: rgba(0, 0, 0, 0.03);
            border-radius: 10px;
        }

        .ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default, .ui-button, html .ui-button.ui-state-disabled:hover, html .ui-button.ui-state-disabled:active {
            border: 1px solid #c5c5c5;
            background: #f6f6f6;
            font-weight: normal;
            color: #454545;
        }

        .ui-sliderSlider .ui-sliderSlider-handle {
            position: absolute;
            z-index: 2;
            width: 1.6em;
            height: 1.2em;
            cursor: default;
            -ms-touch-action: none;
            touch-action: none;
            top: -.3em;
            margin-left: -.6em;
        }

        /* The switch - the box around the slider */
        *.switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        /* The slider */
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked + .slider {
            background-color: #2196F3;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }

        /* Rounded sliders */
        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }

        .mb-3 {
            margin-bottom: 1rem !important;
        }

        .border-primary {
            border-color: #007bff !important;
        }

        .card {
            flex-direction: column;
            background-color: #fff;
            background-clip: border-box;
            border: 1px solid rgba(0, 0, 0, 0.125);
            border-radius: 1rem;
        }

        .card-header:first-child {
            border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
        }

        .card-header {
            padding: 0.75rem 1.25rem;
            margin-bottom: 0;
            background-color: rgba(0, 0, 0, 0.03);
            border-bottom: 1px solid rgba(0, 0, 0, 0.125);
        }

        .card-body {
            -ms-flex: 1 1 auto;
            flex: 1 1 auto;
            min-height: 1px;
            padding: 1rem;
        }

        .field {
            border-radius: 0.25rem;
            border: 1px solid rgba(0, 0, 0, 0.125);
            padding: 0.75rem 1.25rem;
        }

        *, ::before, ::after {
            box-sizing: border-box;
        }
    </style>
    <!------------------------------------------------------------------->

</head>


<body onload="webGLStart();">
<div id=contenu1>
    <canvas id="WebGL-test" style="border:none;" width="600" height="600"></canvas>
    <br><br>
    <button type="button" onclick="loadShaders('shader')">Load Shaders</button>
</div>

<div id=contenu2 class="card border-primary mb-3" style="max-width: 20rem;">
    <div class="card-header">Modifier le canvas</div>

    <div class="card-body">
        <fieldset class="border-primary field">
            <legend>Choisir un quad</legend>
            <select onchange="selectQuad(value)" name="quad-select" id="quad-select">
                <option value="">--Choisir un quad--</option>
                <?php
                    for ($i = 1; $i < glCourseBasis.pathTab.length+1; $i ++) {
                        echo '<option value="pathTab[' . $i . ']"> Quad n° ' . $i .'</option>';
                    }
                ?>
            </select>
            <br>
        </fieldset>

        <!-- ------------------------------------------------ -->

        <fieldset class="border-primary field">
            <legend>Ajouter de la couleur</legend>
            <input type="color" id="colorWell" value="#e66465">
        </fieldset>

        <!-- ------------------------------------------------ -->

        <fieldset class="border-primary field">
            <legend>Modifier la position du quad</legend>
            <div id="slider2">
                <div type="range" id="custom-handle2" class="ui-slider-handle">

                </div>
            </div>
        </fieldset>

        <!-- ------------------------------------------------ -->
    </div>
</div>
</body>


</html>

