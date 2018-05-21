class fisheye {
    constructor (
        r,
        d = 3,
        xw = 0.4
    )
    {
        this.r = r;
        this.x_max = null;
        this.x_min = null;
        this.magnification(d);
            .transitionHardness(xw);
    }

    fisheye(x){

        if (this.focus_x === null)
            return x;

        let dx = x - this.focus_x;

        if (Math.abs(dx) > r || x == this.focus_x)
            return x;

        let dmax = this.r;

        if (dx > 0){
            if (! (this.xmax === null) )
                if ( this.xmax - this.focus_x < this.r)
                    dmax = this.xmax - this.focus_x;
        } 
        else if (dx < 0)
        {
            if (! (this.xmin === null) )
                if ( this.focus_x - this.xmin < this.r)
                    dmax = this.focus_x - this.xmin;
        }

        let d = this.d;
        let xc = this.xc;
        let A1 = this.A1;
        let A2 = this.A2;

        let rescaled = Math.abs(dx) / dmax;

        if (rescaled <= xc)
            return this.focus_x + Math.sign(dx) * dmax * (d/A2*rescaled)**(1/d);
        else
            return this.focus_x + Math.sign(dx) * dmax * 
                                  (1 - ( -1/A1 + Math.sqrt(1/A1**2 + 2*(1-rescaled)/A1) ) );
    }

    solve_linear_equation(a,b,c,d,vector_b) {
        /* solves equation 
          / a  b \  / A1 \   / b1 \
          |      |  |    | = |    |
          \ c  d /  \ A2 /   \ b2 /
        */
        let norm = a*d - b*c;
        let A1 = ( d*vector_b[0] - b*vector_b[1]) / norm;
        let A2 = (-c*vector_b[0] + a*vector_b[1]) / norm;
        return [ A1, A2 ];
    }

    rescale(){
    {
        let xw = this.xw;
        let d = this.d;
        let A = this.solve_linear_equation( xw**2/2.,  Math.pow(1-xw,d)/d, 
                                            xw,       -Math.pow(1-xw,d-1),
                                            [ -(xw-1), -1 ]);
        this.A1 = A[0];
        this.A2 = A[1];

        // this is the critical value of x where the used function changes
        this.xc = 1 - (A1/2 * xw**2 + xw);

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

    transitionHardness(xw){
        if (!arguments.length) return this.xw;
        xw = +xw;
        if (xw < 0.001)
            xw = 0.001;
        if (xw > 0.999)
            xw = 0.999;
        this.xw = +_;
        return this.rescale();
    }

    range(_){
        if (!arguments.length) return [this.xmin, this.xmax];
        this.xmin = _[0];
        this.xmax = _[1];
        return this;
    }
    
    focus(_){
        if (!arguments.length) return [this.xmin, this.xmax];
        this.focus_x = +_;
        return this;
    }

    radius(_){
        if (!arguments.length) return this.r;
        this.r = +_;
        return this;
    }
}

class fisheyeRadial {
    constructor (
        r,
        d = 3,
        xw = 0.4
    )
    {
        this.r = r;
        this.magnification(d);
            .transitionHardness(xw);
    }

    fisheye(x){

        if (this.focus_x === null)
            return x;

        let y = x[1];
        x = x[0];
        let fx = this.focusX[0];
        let fy = this.focusX[1];

        let dr = Math.sqrt( Math.pow(x-fx,2) + Math.pow(x-fy,2) );

        if ((Math.abs(dr) > r) || (dr == 0))
            return x;

        let theta = Math.atan2(y-fy, x-fx);
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        
        let dmax = this.r;
        let d = this.d;
        let xc = this.xc;
        let A1 = this.A1;
        let A2 = this.A2;

        let rescaled = Math.abs(r) / dmax;
        let newX = [0,0];
        let new_r;

        if (rescaled <= xc)
            new_r = (d/A2*rescaled)**(1/d);
        else
            new_r = (1 - ( -1/A1 + Math.sqrt(1/A1**2 + 2*(1-rescaled)/A1) ) );

        newX[0] = fx + cos * dmax * new_r;
        newX[1] = fy + sin * dmax * new_r;

        return newX;
    }

    solve_linear_equation(a,b,c,d,vector_b) {
        /* solves equation 
          / a  b \  / A1 \   / b1 \
          |      |  |    | = |    |
          \ c  d /  \ A2 /   \ b2 /
        */
        let norm = a*d - b*c;
        let A1 = ( d*vector_b[0] - b*vector_b[1]) / norm;
        let A2 = (-c*vector_b[0] + a*vector_b[1]) / norm;
        return [ A1, A2 ];
    }

    rescale(){
    {
        let xw = this.xw;
        let d = this.d;
        let A = this.solve_linear_equation( xw**2/2.,  Math.pow(1-xw,d)/d, 
                                            xw,       -Math.pow(1-xw,d-1),
                                            [ -(xw-1), -1 ]);
        this.A1 = A[0];
        this.A2 = A[1];

        // this is the critical value of x where the used function changes
        this.xc = 1 - (A1/2 * xw**2 + xw);

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

    transitionHardness(xw){
        if (!arguments.length) return this.xw;
        xw = +xw;
        if (xw < 0.001)
            xw = 0.001;
        if (xw > 0.999)
            xw = 0.999;
        this.xw = +_;
        return this.rescale();
    }

    focus(_){
        if (!arguments.length) return [this.xmin, this.xmax];
        this.focusX = _;
        return this;
    }

    radius(_){
        if (!arguments.length) return this.r;
        this.r = +_;
        return this;
    }
}