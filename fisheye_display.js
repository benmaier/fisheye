class fisheyeDisplay {
    constructor(container,width,n_grid,eye,mode='radial')
    {
        this.width = width;
        this.height = width;
        this.canvas = d3.select(container).append('canvas')
                            .attr("class","gridview")
                            .attr('width',width)
                            .attr('height',width);

        this.ctx = this.canvas.node().getContext('2d');
        this.n_grid = n_grid;
        this.fisheye = eye;
        this.mode = mode;

        this.data();
    }

    data()
    {
        let N = 20000;
        let dy = this.width / N;
        let dir1 = [];
        let dir2 = [];
        let dx = this.width / N;
        let dirs_x = [];
        let dirs_y = [];

        let x = 0;

        let trig_factor = 0.4;

        for(var i = 0; i<N; ++i)
        {
            x += dx * 1/( 0.5 * Math.cos(x*trig_factor) + 0.7 );
            //dir1.push(x);
            let y = (Math.sin(x*trig_factor) / 2 + 0.5) * this.height * 0.8 + 0.1 * this.height;
            //let x2 = x + 2*dx * (Math.random()-0.5);
            //y = y + 2*dx * (Math.random()-0.5);
            dir1.push(x);
            dir2.push(y);
            //dir2.push(this.width/3);
        }


        this.dir1 = dir1;
        this.dir2 = dir2;
    }

    plot (x,y)
    {
        this.ctx.moveTo(x[0],y[0]);
        for(var i = 1; i < x.length; ++i)
        {
            this.ctx.lineTo(x[i],y[i]);
        }
    }

    draw() {
        this.ctx.clearRect(0,
                           0, 
                           this.width, 
                           this.height);
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1.1;

        let dir1 = [], dir2 = [];

        for(var i = 0; i<this.dir1.length; ++i)
        {
            let x = this.dir1[i];
            let y = this.dir2[i];
            //let pos = this.fisheye.fisheyeRadial([x,y]);
            let pos;
            if (this.mode == 'radial')
                pos = this.fisheye.fisheyeRadial([x,y]);
            else
                pos = this.fisheye.fisheyeCartesian([x,y]);

            dir1.push(pos[0]);
            dir2.push(pos[1]);
        }

        this.ctx.beginPath();
        this.plot(dir1,dir2);
        this.ctx.stroke();

        this.ctx.beginPath();


        if (! ((this.fisheye.focus() === null)|| (typeof this.fisheye.focus() == 'undefined')))
        {
            this.ctx.save();
            this.ctx.setLineDash([10,10]);
            this.ctx.strokeStyle = "rgba(100,100,100,0.3)";
            this.ctx.lineWidth = 3;
            if (this.mode == 'radial')
                this.ctx.arc(this.fisheye.focus()[0], this.fisheye.focus()[1], this.fisheye.radius(), 0, 2*Math.PI);
            else
            {
                let fx = this.fisheye.focus()[0];
                let fy = this.fisheye.focus()[1];
                let r = this.fisheye.radius();
                let xmin = d3.max([fx-r,0]);
                let xmax = d3.min([fx+r,this.width]);
                let ymin = d3.max([fy-r,0]);
                let ymax = d3.min([fy+r,this.height]);
                this.ctx.beginPath();
                this.ctx.moveTo(0,ymin);
                this.ctx.lineTo(xmin,ymin);
                this.ctx.lineTo(xmin,0);

                this.ctx.moveTo(0,ymax);
                this.ctx.lineTo(xmin,ymax);
                this.ctx.lineTo(xmin,this.height);

                this.ctx.moveTo(this.width,ymax);
                this.ctx.lineTo(xmax,ymax);
                this.ctx.lineTo(xmax, this.height);

                this.ctx.moveTo(this.width,ymin);
                this.ctx.lineTo(xmax,ymin);
                this.ctx.lineTo(xmax,0);

            }
            this.ctx.stroke();
            this.ctx.restore();
        }


        /*
        for(var iy = 0; iy < N + 1; ++iy)
            dir1.push(iy*dy);

        for(var ix = 1; ix < this.n_grid; ++ix)
        {            
            let dir2 = [];
            for(var iy = 0; iy < N + 1; ++iy)
                dir2.push(ix*dx);

            new_x_1 = [];
            new_y_2 = [];

            new_x_1 = [];
            new_y_2 = [];

            for(var iy = 0; iy < N + 1; ++iy)
            {
                newX = this.fisheye.fisheye([dir1[iy], dir2[iy]]);
            }
        }
            for(var ix = 0; ix < Math.floor(this.width / dx); ++ix)
            {


            }
        }
        */

    }
}
