// create a particles engine
var pe = new ParticlesEngine("#particles",
{
    //gravity: new Vector(0,0,-500) 
});

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


// titles
// ==============================================================
pe.createEmitter("#fireTitle",
{
    pps: 10,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});

pe.createEmitter("#iceTitle",
{
    pps: 5,
    spread: 60,
    from: "random",
    particles: ParticlesLib.ice
});

pe.createEmitter("#smokeTitle",
{
    pps: 5,
    spread: 50,
    from: "random",
    particles: ParticlesLib.smoke
});

pe.createEmitter("#radiationTitle",
{
    pps: 5,
    spread: 20,
    from: "random",
    particles: ParticlesLib.radiation
});


// balls
// ==============================================================
pe.createEmitter("#fireBall",
{
    pps: 5,
    spread: 100,
    particles: ParticlesLib.fire
});

pe.createEmitter("#iceBall",
{
    pps: 5,
    spread: 60,
    particles: ParticlesLib.ice
});

pe.createEmitter("#smokeBall",
{
    pps: 5,
    spread: 50,
    particles: ParticlesLib.smoke
});

pe.createEmitter("#radiationBall",
{
    pps: 5,
    spread: 20,
    particles: ParticlesLib.radiation
});


// combined
// ==============================================================
pe.createEmitter("#combined1",
{
    pps: 8,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});

pe.createEmitter("#combined1",
{
    pps: 5,
    spread: 100,
    from: "top",
    particles: ParticlesLib.smoke
});

// ---------------------------------------------
pe.createEmitter("#combined2",
{
    pps: 8,
    spread: 100,
    from: "random",
    particles: ParticlesLib.ice
});

pe.createEmitter("#combined2",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});

// ---------------------------------------------
pe.createEmitter("#combined3",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.radiation
});

pe.createEmitter("#combined3",
{
    pps: 5,
    spread: 100,
    from: "top",
    particles: ParticlesLib.smoke
});

// ---------------------------------------------
pe.createEmitter("#combined4",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});

pe.createEmitter("#combined4",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.ice
});

pe.createEmitter("#combined4",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.radiation
});

pe.createEmitter("#combined4",
{
    pps: 5,
    spread: 100,
    from: "top",
    particles: ParticlesLib.smoke
});

// ---------------------------------------------
pe.createEmitter("#cubeEmitterFront",
{
    pps: 20,
    spread: 100,
    from: "random",
    particles: ParticlesLib.fire
});


pe.createEmitter("#cubeEmitterBack",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.ice
});

pe.createEmitter("#cubeEmitterLeft",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.smoke
});

pe.createEmitter("#cubeEmitterRight",
{
    pps: 5,
    spread: 100,
    from: "random",
    particles: ParticlesLib.radiation
});


// some user interraction stuff
// ==============================================================
for(var i in pe.emitters)
{
    jQuery(pe.emitters[i].parent)
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



TweenMax.to(".cube", 5, {rotationY: "360deg", y: 0, repeat: -1, ease: Linear.easeInOut});

function onlyType(type)
{
    for(var i in pe.emitters)
    {
        if(pe.emitters[i].params.particles.type == type && pe.emitters[i].parent.emitters.length <= 1)
        {
            pe.emitters[i].start();
        }
        else
        {
            pe.emitters[i].stop();
        }
    }
}


jQuery(window).ready(function(){
    jQuery("#auto-click").trigger("click");
});