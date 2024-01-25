# WebEng2
Prüfungsleistung für das Modul Webeng2 an der DHBW Ravensburg Campus FN


## HowTo
``$cd`` in fw7empty bzw. fw7example ordner:

``$ npm install`` zum laden der offenen dependencies.

``$npm start``  starten für fw7 demo.

Für die Kartendemo mit Service Helper einfach index.html im hauptordner aufrufen.


## Todo
Zum Anfang erstmal index.html im Hauptfolder in das leere Framework 7 einsortieren.

Dann basierend darauf Positionsabfrage, Wiki und Navi einpflegen.

## Struktur:
fw7empty: Ein leeres framework7 Projekt mit react

fw7example: Ein beispiel framework7 Projekt mit react.

DHBW: Cloned repo with example projects of Friedhelm Koch

mapWithServiceHelper: functioning PWA with SH, install&offline capable 

## Framework7 CLI Options

Framework7 app created with following options:

```
{
  "cwd": "C:\\Users\\chris\\WebstormProjects\\WebEng2\\fw7empty",
  "type": [
    "web"
  ],
  "name": "WebMap",
  "framework": "react",
  "template": "blank",
  "cssPreProcessor": false,
  "bundler": "vite",
  "theming": {
    "customColor": false,
    "color": "#007aff",
    "darkMode": false,
    "iconFonts": true
  },
  "customBuild": false
}

## Vite

There is a [Vite](https://vitejs.dev) bundler setup. It compiles and bundles all "front-end" resources. You should work only with files located in `/src` folder. Vite config located in `vite.config.js`.

## Assets

Assets (icons, splash screens) source images located in `assets-src` folder. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

```
framework7 assets
```

Or launch UI where you will be able to change icons and splash screens:

```
framework7 assets --ui
```



## Documentation & Resources

* [Framework7 Core Documentation](https://framework7.io/docs/)

* [Framework7 React Documentation](https://framework7.io/react/)

* [Framework7 Icons Reference](https://framework7.io/icons/)
* [Community Forum](https://forum.framework7.io)
