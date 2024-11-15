using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;

public class GameManager : MonoBehaviour
{
    public GameObject playButton;
    public GameObject gameOverText;
    public TextMeshPro killCounterText;
    public Transform player;
    public Vector3 playerStartPosition;

    private int botsDestroyed = 0;
    private bool isGameOver = false;

    private void Awake()
    {
        gameOverText.SetActive(false);
        playButton.SetActive(true);

        Time.timeScale = 0f;
        playerStartPosition = player.position;
    }

    private void Start()
    {
        playButton.GetComponent<Button>().onClick.AddListener(StartGame);
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape) && !isGameOver)
        {
            TogglePause();
        }
    }

    private void StartGame()
    {
        if (isGameOver)
        {
            ResetGame();
        }

        playButton.SetActive(false);
        gameOverText.SetActive(false);
        Time.timeScale = 1f;
        isGameOver = false;
    }

    private void TogglePause()
    {
        if (Time.timeScale == 0)
        {
            playButton.SetActive(false);
            Time.timeScale = 1f;
        }
        else
        {
            playButton.SetActive(true);
            Time.timeScale = 0f;
        }
    }

    public void TriggerGameOver()
    {
        isGameOver = true;
        gameOverText.SetActive(true);
        playButton.SetActive(true);
        Time.timeScale = 0f;
    }

    private void ResetGame()
    {
        botsDestroyed = 0;
        killCounterText.text = botsDestroyed.ToString();
        player.position = playerStartPosition;

        foreach (GameObject bot in GameObject.FindGameObjectsWithTag("CircleBot"))
        {
            Destroy(bot);
        }

        foreach (GameObject bot in GameObject.FindGameObjectsWithTag("ChaseBot"))
        {
            Destroy(bot);
        }

        BotSpawner spawner = FindObjectOfType<BotSpawner>();
        spawner.ResetSpawner();
        
        isGameOver = false;
        Time.timeScale = 1f;
    }

    public void IncrementKillCounter()
    {
        botsDestroyed++;
        killCounterText.text = botsDestroyed.ToString();
    }

    public int BotsDestroyed
    {
        get { return botsDestroyed; }
    }
}
