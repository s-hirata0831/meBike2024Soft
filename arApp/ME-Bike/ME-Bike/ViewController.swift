import UIKit
import ARKit
import CoreLocation
import WebKit
import MapKit

class ViewController: UIViewController, ARSCNViewDelegate, CLLocationManagerDelegate {
    @IBOutlet var sceneView: ARSCNView!
    @IBOutlet weak var distanceLabel: UILabel!//位置情報取得のために追加
    
    //位置情報取得のために追加
    var locationManager = CLLocationManager()
    let targetLocation = CLLocationCoordinate2D(latitude: 35.468716,longitude: 135.395109)
    
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
        
        // CoreLocationの設定
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        locationManager.distanceFilter = kCLDistanceFilterNone
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        // ARセッションの設定
        let configuration = ARWorldTrackingConfiguration()
        configuration.worldAlignment = .gravityAndHeading
        sceneView.session.run(configuration)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        // ARセッションを一時停止
        sceneView.session.pause()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        
        // 現在の位置を取得
        let currentLocation = location.coordinate
        
        // 距離を計算
        let distance = location.distance(from: CLLocation(latitude: targetLocation.latitude, longitude: targetLocation.longitude))
        distanceLabel.text = String(format: "%.2f meters", distance)
        
        // 方角を計算
        let direction = getDirection(from: currentLocation, to: targetLocation)
        
        // 3Dモデルの位置を更新
        placeModelInDirection(direction: direction, distance: distance)
    }
    
    func getDirection(from: CLLocationCoordinate2D, to: CLLocationCoordinate2D) -> Double {
        let fromLat = degreesToRadians(from.latitude)
        let fromLon = degreesToRadians(from.longitude)
        let toLat = degreesToRadians(to.latitude)
        let toLon = degreesToRadians(to.longitude)
        
        let deltaLon = toLon - fromLon
        let y = sin(deltaLon) * cos(toLat)
        let x = cos(fromLat) * sin(toLat) - sin(fromLat) * cos(toLat) * cos(deltaLon)
        let radiansBearing = atan2(y, x)
        
        return radiansToDegrees(radiansBearing)
    }
    
    func degreesToRadians(_ degrees: Double) -> Double {
        return degrees * .pi / 180.0
    }
    

    func radiansToDegrees(_ radians: Double) -> Double {
        return radians * 180.0 / .pi
    }
    
    func placeModelInDirection(direction: Double, distance: CLLocationDistance) {
        // デバイスの向きを取得
        guard let currentFrame = sceneView.session.currentFrame else { return }
        let cameraTransform = currentFrame.camera.transform
        let cameraOrientation = SCNVector3(-cameraTransform.columns.2.x, -cameraTransform.columns.2.y, -cameraTransform.columns.2.z)
        let cameraPosition = SCNVector3(cameraTransform.columns.3.x, cameraTransform.columns.3.y, cameraTransform.columns.3.z)
        
        // 既存のターゲットノードを削除
        sceneView.scene.rootNode.childNode(withName: "targetNode", recursively: true)?.removeFromParentNode()
        
        // 3Dモデルを方向に配置
        let node = SCNNode()
        node.name = "targetNode"
        let box = SCNBox(width: 0.1, height: 0.1, length: 0.1, chamferRadius: 0)
        node.geometry = box
        
        // directionを元にノードの位置を計算
        let distanceInMeters: Float = 0.5
        let angleInRadians = Float(degreesToRadians(direction))
        let x = distanceInMeters * cos(angleInRadians)
        let z = distanceInMeters * sin(angleInRadians)
        
        // カメラの向きに対してモデルを配置
        node.position = SCNVector3(cameraPosition.x + x * cameraOrientation.z,
                                   cameraPosition.y,
                                   cameraPosition.z + z * cameraOrientation.z)
        
        sceneView.scene.rootNode.addChildNode(node)
        addTextNode(direction: direction, distance: distance)
    }
    
    func addTextNode(direction: Double, distance: CLLocationDistance) {
        guard let currentFrame = sceneView.session.currentFrame else { return }
        let cameraTransform = currentFrame.camera.transform
        let cameraOrientation = SCNVector3(-cameraTransform.columns.2.x, -cameraTransform.columns.2.y, -cameraTransform.columns.2.z)
        let cameraPosition = SCNVector3(cameraTransform.columns.3.x, cameraTransform.columns.3.y, cameraTransform.columns.3.z)
        
        let textNode = SCNNode()
        let textGeometry = SCNText(string: String(format: "自転車置き場まであと %.2f m", distance), extrusionDepth: 1.0)
        textGeometry.firstMaterial?.diffuse.contents = UIColor.red  // 文字色を赤に設定
        textNode.geometry = textGeometry
        textNode.scale = SCNVector3(0.05, 0.05, 0.05)  // 文字のサイズを調整
        
        let angleInRadians = Float(degreesToRadians(direction))
        let x = 0.5 * cos(angleInRadians)
        let z = 0.5 * sin(angleInRadians)
        
        textNode.position = SCNVector3(cameraPosition.x + x * cameraOrientation.x - z * cameraOrientation.z,
                                       cameraPosition.y + 0.3,  // 高さ調整
                                       cameraPosition.z + z * cameraOrientation.x + x * cameraOrientation.z)
        
        sceneView.scene.rootNode.addChildNode(textNode)
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

class mapViewController: UIViewController, WKNavigationDelegate{
    @IBOutlet weak var mapView: MKMapView!
    
    override func viewDidLoad(){
        super.viewDidLoad()
        setupMapView()
    }
    
    func setupMapView(){
        // マップの初期表示位置を設定する例
        let initialLocation = CLLocation(latitude: 35.468716,longitude: 135.395109)
        let regionRadius: CLLocationDistance = 1000
        let coordinateRegion = MKCoordinateRegion(center: initialLocation.coordinate,latitudinalMeters: regionRadius, longitudinalMeters: regionRadius)
        mapView.setRegion(coordinateRegion, animated: true)
    }
}
