var ParticlesLib = 
{
    fire:
    {
        type: "fire",
        src: "images/fire.png",
        lifetime: 1,
        size: 140,
        mass: -2,
        sticky: 2
    },
    ice:
    {
        type: "ice",
        src: "images/ice.png",
        lifetime: 1.5,
        size: 80,
        mass: 0.5
    },
    smoke:
    {
        type: "smoke",
        src: "images/smoke.png",
        lifetime: 2,
        size: 130,
        mass: -0.8
    },
    radiation:
    {
        type: "radiation",
        src: "images/radiation.png",
        lifetime: 1,
        size: 160,
        mass: 0.8
    }
}

// init the particles engine
ParticlesEngine.init();

// create the default environment
var env = ParticlesEngine.createEnvironment();


// titles
// ==============================================================
env.createEmitter("#fireTitle",
{
    pps: 10,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});

env.createEmitter("#iceTitle",
{
    pps: 5,
    spread: 60,
    from: "random",
    particles: ParticlesLib.ice
});

env.createEmitter("#smokeTitle",
{
    pps: 5,
    spread: 50,
    from: "random",
    particles: ParticlesLib.smoke
});

env.createEmitter("#radiationTitle",
{
    pps: 5,
    spread: 20,
    from: "random",
    particles: ParticlesLib.radiation
});


// balls
// ==============================================================
env.createEmitter("#fireBall",
{
    pps: 5,
    spread: 100,
    particles: ParticlesLib.fire
});

env.createEmitter("#iceBall",
{
    pps: 5,
    spread: 60,
    particles: ParticlesLib.ice
});

env.createEmitter("#smokeBall",
{
    pps: 5,
    spread: 50,
    particles: ParticlesLib.smoke
});

env.createEmitter("#radiationBall",
{
    pps: 5,
    spread: 20,
    particles: ParticlesLib.radiation
});


// combined
// ==============================================================
env.createEmitter("#combined1",
{
    pps: 8,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});

env.createEmitter("#combined1",
{
    pps: 5,
    spread: 100,
    from: "top",
    particles: ParticlesLib.smoke
});

// ---------------------------------------------
env.createEmitter("#combined2",
{
    pps: 8,
    spread: 100,
    from: "random",
    particles: ParticlesLib.ice
});

env.createEmitter("#combined2",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});

// ---------------------------------------------
env.createEmitter("#combined3",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.radiation
});

env.createEmitter("#combined3",
{
    pps: 5,
    spread: 100,
    from: "top",
    particles: ParticlesLib.smoke
});

// ---------------------------------------------
env.createEmitter("#combined4",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});

env.createEmitter("#combined4",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.ice
});

env.createEmitter("#combined4",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.radiation
});

env.createEmitter("#combined4",
{
    pps: 5,
    spread: 100,
    from: "top",
    particles: ParticlesLib.smoke
});


// 3D cube
// ==============================================================
env.createEmitter("#cubeEmitterFront",
{
    relative: true,
    pps: 20,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});

env.createEmitter("#cubeEmitterBack",
{
    relative: true,
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.ice
});

env.createEmitter("#cubeEmitterLeft",
{
    relative: true,
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.smoke
});

env.createEmitter("#cubeEmitterRight",
{
    relative: true,
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.radiation
});


// create a particles environment with no gravity for particles in 3D cube
var env2 = ParticlesEngine.createEnvironment(
{
    gravity: new Vector(0,0,0),
    friction: 0.4
});

var cubeMagicEmitt = env2.createEmitter("#cubeEmitterDummy",
{
    relative: true,
    spread: 1000,
    particles:
    {
        rotate: new Vector(1,1,1),
        size: [5,10],
        lifetime: 3,
        round: false
    },
    from: "center"
})
.burst(20);


// some user interraction stuff
// ==============================================================
for(var i in env.emitters)
{
    jQuery(env.emitters[i].parent)
    .css({cursor: "pointer"})
    .attr("onclick", "for(var i in this.emitters){ this.emitters[i].toogle(); }");
}

var i = 0;
var speed = 4;
jQuery(".moving.emitter").each(function()
{
    var elem = this;
    var delay = (speed / 4) * i++;

    TweenMax.to(elem, speed, {left: "85%", z: -100, yoyo: true, repeat: -1, ease: Linear.easeInOut, delay: delay, onRepeat: function()
    {
        TweenMax.to(elem, 0.5, {top: "-50px", ease: Quad.easeOut, onComplete: function()
        {
            TweenMax.to(elem, 1.5, {top: "0px", ease: Bounce.easeOut});
        }});
    }});
});



TweenMax.to(".rotate", 8, {rotationY: "360deg", y: 0, repeat: -1, ease: Linear.easeInOut});

function onlyType(type)
{
    for(var i in env.emitters)
    {
        if(env.emitters[i].params.particles.type == type && env.emitters[i].parent.emitters.length <= 1)
        {
            env.emitters[i].start();
        }
        else
        {
            env.emitters[i].stop();
        }
    }
}

function toogle_class(sel,c)
{
    var s = jQuery(sel);
    if(s.hasClass(c))
    {
        s.removeClass(c);
    }
    else
    {
        s.addClass(c);
    }
}


jQuery(window).ready(function(){
    //jQuery("#auto-click").trigger("click");
});