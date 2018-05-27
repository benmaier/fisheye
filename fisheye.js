class fisheye {
    constructor (
        r,
        d = 3,
        xw = 0.4,
        mode = 'continuous'
    )
    {
        this.r = r;
        this.x_max = null;
        this.x_min = null;

        this.range_x = null;
        this.range_y = null;
        this.magnification(d)
            .demagnificationWidth(xw);
        this.mode = mode;

        this.focus_x = null;
    }

    fisheye(x,direction = 0){

        if (this.focus_x === null)
            return x;

        let focus = this.focus_x[direction];

        let dx = x - focus;

        if ((Math.abs(dx) > this.r) || (x == focus))
            return x;

        let dmax = this.r;
        let range;
        if (direction == 0)
            range = this.range_x;
        else
            range = this.range_y;

        if (dx > 0){
            if (! (range === null) )
                if ( range[1] - focus < this.r)
                    dmax = range[1] - focus;
        } 
        else if (dx < 0)
        {
            if (! (range === null) )
                if ( focus - range[0] < this.r)
                    dmax = focus - range[0];
        }

        let d = this.d;
        let xc = this.xc;
        let A1 = this.A1;
        let A2 = this.A2;

        let rescaled = Math.abs(dx) / dmax;

        let new_r;

        if (this.mode == 'continuous')
            new_r = this.fisheyeContinuous(rescaled);
        else if (this.mode == 'sarkar')
            new_r = this.fisheyeSarkar(rescaled);
        else
            throw 'Unknown mode "'+ this.mode + '"';

        return focus + Math.sign(dx) * dmax * new_r;
    }

    fisheyeCartesian(pos) {
        let x = this.fisheye(pos[0],0);
        let y = this.fisheye(pos[1],1);
        return [x,y];
    }

    solve_linear_equation(a,b,c,d,vector_b) {
        /* solves equation 
          / a  b \  / A1 \   / b1 \
          |      |  |    | = |    |
          \ c  d /  \ A2 /   \ b2 /
        */
        let det = a*d - b*c;
        let A1 = ( d*vector_b[0] - b*vector_b[1]) / det;
        let A2 = (-c*vector_b[0] + a*vector_b[1]) / det;
        return [ A1, A2 ];
    }

    rescale()
    {
        let xw = this.xw;
        let d = this.d;
        let A = this.solve_linear_equation( Math.pow(xw,2)/2., 1 - ((d+1)*xw / (d*xw+1)), 
                                            xw,                - (d+1) / Math.pow(d*xw+1,2),
                                            [ (1-xw), -1 ]);
        this.A1 = A[0];
        this.A2 = A[1];

        // this is the critical value of x where the used function changes
        this.xc = 1 - (this.A1/2 * Math.pow(xw,2) + xw);

        console.log(this.A1, this.A2, this.xc);

        return this;
    }

    magnification(d){
        if (!arguments.length) return this.d;
        d = +d;
        if (d <= 1)
            d = 1;

        this.d = d;
        return this.rescale();
    }

    demagnificationWidth(xw){
        if (!arguments.length) return this.xw;
        xw = +xw;
        if (xw < 0.001)
            xw = 0.001;
        if (xw > 0.999)
            xw = 0.999;
        this.xw = xw;
        return this.rescale();
    }

    rangeX(_){
        if (!arguments.length) return this.range_x;
        this.range_x = _;
        return this;
    }

    range(_){
        return rangeX(_);
    }
    
    rangeY(_){
        if (!arguments.length) return this.range_y;
        this.range_y = _;
        return this;
    }
    
    focus(_){
        if (!arguments.length) return this.focus_x;
        this.focus_x = _;
        return this;
    }

    radius(_){
        if (!arguments.length) return this.r;
        this.r = +_;
        return this;
    }

    fisheyeRadial(pos){

        if ((this.focus_x === null)|| (typeof this.focus_x == 'undefined'))
            return pos;

        let x = pos[0];
        let y = pos[1];

        let fx = this.focus_x[0];
        let fy = this.focus_x[1];

        let dr = Math.sqrt( Math.pow(x-fx,2) + Math.pow(y-fy,2) );

        if ((Math.abs(dr) > this.r) || (dr == 0))
        {
            //console.log('identity!');
            return pos;
        }

        let theta = Math.atan2(y-fy, x-fx);
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        
        let dmax = this.r;
        let d = this.d;
        let xc = this.xc;
        let A1 = this.A1;
        let A2 = this.A2;

        let rescaled = dr / dmax;
        let newX = [0,0];
        let new_r;

        if (this.mode == 'continuous')
            new_r = this.fisheyeContinuous(rescaled);
        else if (this.mode == 'sarkar')
            new_r = this.fisheyeSarkar(rescaled);

        newX[0] = fx + cos * dmax * new_r;
        newX[1] = fy + sin * dmax * new_r;

        return newX;
    }

    fisheyeContinuous(x){
        if (x <= this.xc)            
            return (x * (this.d+1)) / (this.d*x + this.A2);
        else
            return 1 - ( -1/this.A1 + Math.sqrt(1/(this.A1*this.A1) + 2*(1-x)/this.A1) ) ;
    }

    /*
    fisheyeInverseContinuous(x){
        if (x <= this.xc)            
            return x*this.A2 / (this.d*(1-x) + 1);
        else
            return this.x - (this.A1 / 2 *Math.pow(1-x,2));
    }
    */

    fisheyeSarkar(x) {
        return (this.d+1) * x / (this.d*x + 1);
    }
}
