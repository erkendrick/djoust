using UnityEngine;

public class ScreenWrap : MonoBehaviour
{
    private float screenLeft;
    private float screenRight;
    private float playerWidth;

    void Start()
    {
        // Convert screen edges to world space
        Vector2 screenBounds = Camera.main.ScreenToWorldPoint(new Vector2(Screen.width, Screen.height));
        screenRight = screenBounds.x;
        screenLeft = -screenBounds.x;
        playerWidth = 0.5f;
    }

    void Update()
    {
        WrapPosition();
    }

    private void WrapPosition()
    {
        Vector3 newPosition = transform.position;

        // Check if the player has moved off screen edges with playerWidth offset
        if (transform.position.x > screenRight + playerWidth)
        {
            newPosition.x = screenLeft - playerWidth;
        }
        else if (transform.position.x < screenLeft - playerWidth)
        {
            newPosition.x = screenRight + playerWidth;
        }

        transform.position = newPosition;
    }
}
