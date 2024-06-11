import UIKit
import ARKit
import WebKit

class ViewController: UIViewController, ARSCNViewDelegate {
    @IBOutlet var sceneView: ARSCNView!

    override func viewDidLoad() {
        super.viewDidLoad()

        // ARSCNViewDelegateの設定
        sceneView.delegate = self
        
        sceneView.debugOptions = .showWorldOrigin
        sceneView.showsStatistics = true

        // シーンファイルを読み込む
        guard let scene = SCNScene(named: "art.scnassets/cube.scn") else {
            fatalError("Scene file not found")
        }
        sceneView.scene = scene
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        // ARセッションの設定
        let configuration = ARWorldTrackingConfiguration()
        sceneView.session.run(configuration)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        // ARセッションを一時停止
        sceneView.session.pause()
    }
}

class webViewController: UIViewController, WKNavigationDelegate{
    @IBOutlet weak var webView: WKWebView!
    override func viewDidLoad(){
        super.viewDidLoad()
        webView.navigationDelegate = self
        loadWebPage()
    }
    
    func loadWebPage(){
        if let url = URL(string: "https://karayab2024.web.app"){
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
}
