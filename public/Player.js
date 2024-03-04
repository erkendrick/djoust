class Player {
    constructor({ position, color = 'blue', direction, orientation }) {
        this.x = position.x;
        this.y = position.y;
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
        this.x = position.x;
        this.y = position.y;
        this.direction = direction; 
        this.orientation = orientation; 
        this.color = color;
    }

    draw(ctx) {
    
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = this.weapon.color;

        const weaponOrientation = this.orientation === 'left' ? this.x - this.weapon.width : this.x + this.width;
        ctx.fillRect(weaponOrientation, this.y + this.weapon.offsetY, this.weapon.width, this.weapon.height);

    }
}

export default Player;

