class fisheyeDisplay {
    constructor(container,width,n_grid,eye)
    {
        this.width = width;
        this.height = width;
        this.canvas = d3.select(container).append('canvas')
                            .attr('width',width)
                            .attr('height',width);
        this.ctx = this.canvas.node().getContext('2d');
        this.n_grid = n_grid;
        this.fisheye = eye;

        this.data();
    }

    data()
    {
        let N = 100;
        let dy = this.width / N;
        let dir1 = [];
        let dir2 = [];
        let dx = self.width / 300;

        for(var i = 0; i<300; ++i)
        {
            let x = dx * i;
            dir1.push(x);
            let y = (Math.sin(10*x) / 2 + 0.5) * this.height * 0.8;
            x = x + 2*dx * (Math.random()-0.5);
            y = y + 2*dx * (Math.random()-0.5);
            //dir1.push(x);
            dir2.push(this.width/3);
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
        this.ctx.lineWidth = 1;

        let dir1 = [], dir2 = [];

        for(var i = 0; i<this.dir1.length; ++i)
        {
            let x = this.dir1[i];
            let y = this.dir2[i];
            let pos = this.fisheye.fisheyeRadial([x,y]);
            dir1.push(pos[0]);
            dir2.push(pos[1]);
        }

        this.ctx.beginPath();
        this.plot(dir1,dir2);
        this.ctx.stroke();


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
