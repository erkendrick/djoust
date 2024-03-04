
function playerPlatformCollision(player, platforms) {

    platforms.forEach(platform => {
        const playerBottom = player.position.y + player.height;
        const playerTop = player.position.y;
        const playerLeft = player.position.x;
        const playerRight = player.position.x + player.width;

        const platformBottom = platform.y + platform.height;
        const platformTop = platform.y;
        const platformLeft = platform.x;
        const platformRight = platform.x + platform.width;

        if (playerRight > platformLeft && playerLeft < platformRight && playerBottom > platformTop && playerTop < platformBottom) {

            const overlapBottom = playerBottom - platformTop;
            const overlapTop = platformBottom - playerTop;
            const overlapLeft = playerRight - platformLeft;
            const overlapRight = platformRight - playerLeft;

            const minOverlap = Math.min(overlapBottom, overlapTop, overlapLeft, overlapRight);

            if (minOverlap === overlapBottom) {
                player.velocity.y = 0;
                player.position.y = platformTop - player.height;
            } else if (minOverlap === overlapTop) {
                player.velocity.y = 0;
                player.position.y = platformBottom;
            } else if (minOverlap === overlapLeft) {
                player.velocity.x = 0;
                player.position.x = platformLeft - player.width;
            } else if (minOverlap === overlapRight) {
                player.velocity.x = 0;
                player.position.x = platformRight;
            }
        }
    });
}

function playerPlayerCollision(player1, player2) {
    
    const expansion = 1; 
    const p1Hitbox = {
        left: player1.position.x - expansion,
        right: player1.position.x + player1.width + expansion,
        top: player1.position.y - expansion,
        bottom: player1.position.y + player1.height + expansion,
    };
    const p2Hitbox = {
        left: player2.position.x - expansion,
        right: player2.position.x + player2.width + expansion,
        top: player2.position.y - expansion,
        bottom: player2.position.y + player2.height + expansion,
    };

    if (p1Hitbox.right > p2Hitbox.left && p1Hitbox.left < p2Hitbox.right &&
        p1Hitbox.bottom > p2Hitbox.top && p1Hitbox.top < p2Hitbox.bottom) {

        const overlapBottom = p1Hitbox.bottom - p2Hitbox.top;
        const overlapTop = p2Hitbox.bottom - p1Hitbox.top;
        const overlapLeft = p1Hitbox.right - p2Hitbox.left;
        const overlapRight = p2Hitbox.right - p1Hitbox.left;

        const minOverlap = Math.min(overlapBottom, overlapTop, overlapLeft, overlapRight);

        if (minOverlap === overlapBottom || minOverlap === overlapTop) {
            const separation = expansion + 1; 
            if (minOverlap === overlapBottom) {
                player1.position.y -= separation;
                player2.position.y += separation;
                player1.velocity.y = -Math.abs(player1.velocity.y); 
            } else {
                
                player1.position.y += separation;
                player2.position.y -= separation;
                player2.velocity.y = -Math.abs(player2.velocity.y); 
            }
        } else {
            const separation = expansion + 1; 
            if (minOverlap === overlapLeft) {
                player1.position.x -= separation;
                player2.position.x += separation;
            } else {
                player1.position.x += separation;
                player2.position.x -= separation;
            }
            player1.velocity.x = 0;
            player2.velocity.x = 0;
        }
    }
}

function weaponWeaponCollision(player1, player2) {
    const weapon1 = getWeaponBoundingBox(player1);
    const weapon2 = getWeaponBoundingBox(player2);

    if (isColliding(weapon1, weapon2)) {
        const isHeadOnCollision = (player1.orientation === 'right' && player2.orientation === 'left' && weapon1.x + weapon1.width >= weapon2.x) ||
                                  (player1.orientation === 'left' && player2.orientation === 'right' && weapon1.x <= weapon2.x + weapon2.width);

        if (isHeadOnCollision) {
            const overlapX = Math.min(weapon1.x + weapon1.width - weapon2.x, weapon2.x + weapon2.width - weapon1.x);
            const impactForce = 5;

            if (weapon1.x < weapon2.x) {
                player1.velocity.x -= overlapX + impactForce;
                player2.velocity.x += overlapX + impactForce;
            } else {
                player1.velocity.x += overlapX + impactForce;
                player2.velocity.x -= overlapX + impactForce;
            }
        }
    }
}

function weaponPlatformCollision(player, platforms) {

    const weaponBox = getWeaponBoundingBox(player);
    platforms.forEach(platform => {
        const platformBox = { x: platform.x, y: platform.y, width: platform.width, height: platform.height };
        if (isColliding(weaponBox, platformBox)) {
            player.velocity.x = 0;
            player.velocity.y = 0;
            player.embedded = true;
            return;
        }
    });
}

function updatePlayerEmbeddedState(player, platforms) {
    const weaponBox = getWeaponBoundingBox(player);
    let isStillEmbedded = false;

    platforms.forEach(platform => {
        const platformBox = { x: platform.x, y: platform.y, width: platform.width, height: platform.height };
        if (isColliding(weaponBox, platformBox)) {
            isStillEmbedded = true;
            return;
        }
    });

    if (!isStillEmbedded) {
        player.embedded = false;
    }
}

function getWeaponBoundingBox(player) {

    let weaponX = player.orientation === 'left' ? player.position.x - player.weapon.width : player.position.x + player.width;
    let weaponY = player.position.y + player.weapon.offsetY;

    return {
        x: weaponX,
        y: weaponY,
        width: player.weapon.width,
        height: player.weapon.height
    };
}

function isColliding(rectA, rectB) {
    const colliding = rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width > rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y;
    return colliding;
}

export {
    playerPlatformCollision,
    playerPlayerCollision,
    weaponWeaponCollision,
    weaponPlatformCollision,
    updatePlayerEmbeddedState,
    getWeaponBoundingBox,
    isColliding
}