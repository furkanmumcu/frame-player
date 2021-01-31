class FramePlayer {

    constructor(divID) {
        this.divID = divID;
    }

    frames = [];
    totalFrameCount;
    currentFrame = 0;
    isPLaying = false;

    hi() {
        console.log('hi');
    }

    load() {
        let startTime = Date.now();

        this.getFramesByPic('img/0.jpg');
        this.getFramesByPic('img/1.jpg');
        this.getFramesByPic('img/2.jpg');
        this.getFramesByPic('img/3.jpg');
        this.getFramesByPic('img/4.jpg');
        this.getFramesByPic('img/5.jpg');
        this.getFramesByPic('img/6.jpg');

        let endTime = Date.now();

        var downloadcomplete = new CustomEvent('downloadcomplete');
        downloadcomplete.ms = endTime - startTime;
        container.dispatchEvent(downloadcomplete);

    }

    getFramesByPic(imageLocation) {
        var image = new Image();
        image.src = imageLocation;
        image.setAttribute('crossOrigin', 'null');
        image.onload = this.cutImage;

    }

    cutImage() {
        for (var x = 0; x < 5; ++x) {
            for (var y = 0; y < 5; ++y) {
                var canvas = document.createElement('canvas');
                let widthOfOnePiece = 640 / 5;
                let heightOfOnePiece = 360 / 5
                canvas.width = widthOfOnePiece;
                canvas.height = heightOfOnePiece;
                var context = canvas.getContext('2d');
                context.drawImage(this, y * widthOfOnePiece, x * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
                //frames.push(canvas.toDataURL());
                self.player.frames.push(canvas.toDataURL());
            }
        }
    }

    on(name, cb) {
        let container = document.getElementById(this.divID);
        if (name == 'downloadcomplete') {
            container.addEventListener('downloadcomplete', function (data) {
                cb(data.ms);
            }, false);
        }
        if (name == 'play') {
            container.addEventListener('play', function (data) {
                cb(data.ms);
            }, false);
        }
        if (name == 'pause') {
            container.addEventListener('pause', function (data) {
                cb(data.ms);
            }, false);
        }
        if (name == 'end') {
            container.addEventListener('end', function (data) {
                cb();
            }, false);
        }
    }

    timer = ms => new Promise(res => setTimeout(res, ms))

    async play() { 
        let anImageElement = document.getElementById('frameImg');
        
        for (var i = this.currentFrame; i < 175; i++) {
            if(self.player.isPLaying){
                if(i == 174){
                    let onEnd = new CustomEvent('end');
                    container.dispatchEvent(onEnd);
                }
                else{
                    let onPlay = new CustomEvent('play');
                    onPlay.ms = (i+1) * 100;
                    container.dispatchEvent(onPlay);
                }
                //console.log(i);
                self.player.currentFrame = i;
                anImageElement.src = self.player.frames[i];
                this.updateProgressBar();
                await this.timer(100);
            }
            else{
                i = 175;
            }
        }
    }


    pause() {
        this.isPLaying = false;
        let onPause = new CustomEvent('pause');
        onPause.ms = (this.currentFrame + 1) * 100;
        container.dispatchEvent(onPause);
    }

    reset() {
        this.currentFrame = 0;
    }

    imgClick(){
        if(this.isPLaying){
            this.pause();
        }
        else{
            this.isPLaying = true;
            this.play();
        }
    }

    barClick(clickedValue){
        this.currentFrame = clickedValue;
        if(this.isPLaying){
            this.pause();
        }
        let anImageElement = document.getElementById('frameImg');
        anImageElement.src = self.player.frames[clickedValue]
    }

    updateProgressBar(){
        let bar = document.getElementById('progressBar');
        bar.value = this.currentFrame;
    }

}