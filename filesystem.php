<?php
	
	class FileSystem {
		private $file;

		public function get ($filename) {

			return json_encode(readfile($filename), true);
		}

		public function post ($userdata) {

			$file = fopen($userdata['url'], 'w');
			fwrite($file, $userdata['data']);
			fclose($file);

			return json_encode(readfile($userdata['url']), true);
		}
	}

	$fileSystem = new FileSystem();
	// Dynamic function calling
	$fileSystem->$_POST['method']($_POST['data']);

?>