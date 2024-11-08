class Player {
    constructor({ position, color = 'blue', direction, orientation }) {
        this.position = position;
        this.color = color;
        this.width = 30;
        this.height = 40;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.acceleration = {
            x: 0,
            y: 0
        };
        this.mass = 1;
        this.direction = direction;
        this.orientation = orientation;
        this.weapon = {
            width: 20,
            height: 10,
            color: 'grey',
            offsetY: 10,
        };
    }

    update({ position, direction, orientation, color }) {
        this.position = position;
        this.direction = direction; 
        this.orientation = orientation; 
        this.color = color;
    }

    draw(ctx) {
    
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        ctx.fillStyle = this.weapon.color;
        const weaponOrientation = this.orientation === 'left' ? this.position.x - this.weapon.width : this.position.x + this.width;
        ctx.fillRect(weaponOrientation, this.position.y + this.weapon.offsetY, this.weapon.width, this.weapon.height);

    }
}

export default Player;

