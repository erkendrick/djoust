using UnityEngine;

public class BotSpawner : MonoBehaviour
{
    public GameObject botPrefab;
    public float horizontalOffset = 7.1f;
    public float minVerticalPosition = 0.5f;
    public float maxverticalPosition = 3f;
    
    public float initialSpeed = 3f;
    public float initialAngularVelocity = 120f;

    private void Update()
    {
        if (GameObject.FindGameObjectsWithTag("Bot").Length == 0)
        {
            SpawnBot();
        }
    }

    private void SpawnBot()
    {
        int side = Random.Range(0, 2) * 2 - 1; // generates -1 or 1 to determine left or right side
        float xPosition = side * horizontalOffset;

        float yPosition;
        if (Random.value < 0.5f)
        {
            yPosition = Random.Range(0.5f, 3f); // upper range
        }
        else
        {
            yPosition = Random.Range(-0.5f, -3f); // lower range
        }

        Vector2 spawnPosition = new Vector2(xPosition, yPosition);

        GameObject newBot = Instantiate(botPrefab, spawnPosition, Quaternion.identity);
        Rigidbody2D botRigidBody = newBot.GetComponent<Rigidbody2D>();
        botRigidBody.velocity = new Vector2(-side * initialSpeed, 0);
        botRigidBody.angularVelocity = initialAngularVelocity;
    }
}
